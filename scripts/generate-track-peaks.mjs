#!/usr/bin/env node
/**
 * Precompute waveform peak data for every track in the S3 bucket.
 *
 * The music page renders a SoundCloud-style waveform seeker. Deriving peaks in
 * the browser would mean downloading each MP3 a second time (the <audio> element
 * streams its own copy), and Vercel's serverless runtime has no audio decoder,
 * so the peaks are generated offline here and committed alongside the code.
 *
 * Output: src/app/data/track-peaks.json — one entry per S3 object key holding
 * base64-encoded 8-bit peak buckets plus the track's exact duration.
 *
 * Usage: pnpm peaks:generate   (requires ffmpeg and AWS credentials)
 */

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';
import { ListObjectsV2Command, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Number of peak buckets stored per track. Matches PEAK_RESOLUTION on the client. */
const RESOLUTION = 400;
/** Decoding samplerate — plenty for envelope extraction and fast to decode. */
const SAMPLE_RATE = 11025;
const CONCURRENCY = 4;
const OUTPUT_PATH = join(__dirname, '..', 'src', 'app', 'data', 'track-peaks.json');

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error('Run with credentials loaded, e.g. `pnpm peaks:generate`.');
    process.exit(1);
  }
  return value;
};

const BUCKET = required('AWS_BUCKET_NAME');

const s3 = new S3Client({
  region: required('AWS_REGION'),
  credentials: {
    accessKeyId: required('AWS_ACCESS_KEY_ID'),
    secretAccessKey: required('AWS_SECRET_ACCESS_KEY'),
  },
});

async function listTrackKeys() {
  const keys = [];
  let continuationToken;

  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'tracks/',
        ContinuationToken: continuationToken,
      })
    );

    for (const item of response.Contents ?? []) {
      if (item.Key && /\.(mp3|wav)$/i.test(item.Key)) keys.push(item.Key);
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys.sort();
}

async function downloadToFile(key, destination) {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );
  const bytes = await response.Body.transformToByteArray();
  await writeFile(destination, bytes);
}

/** Decode an audio file to mono 32-bit float PCM using ffmpeg. */
function decodeToPcm(filePath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-v', 'error',
      '-i', filePath,
      '-f', 'f32le',
      '-ac', '1',
      '-ar', String(SAMPLE_RATE),
      'pipe:1',
    ]);

    const chunks = [];
    let stderr = '';

    ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));
    ffmpeg.stderr.on('data', (chunk) => (stderr += chunk));
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with ${code}: ${stderr.trim()}`));
        return;
      }

      const raw = Buffer.concat(chunks);
      // Copy into an aligned buffer — Buffer.concat gives no alignment guarantee
      const aligned = new ArrayBuffer(raw.length - (raw.length % 4));
      Buffer.from(aligned).set(raw.subarray(0, aligned.byteLength));
      resolve(new Float32Array(aligned));
    });
  });
}

/**
 * Reduce PCM samples to RESOLUTION normalized buckets holding each bucket's
 * peak amplitude, quantized to a single byte.
 */
function computePeaks(samples) {
  const bucketSize = Math.max(1, Math.floor(samples.length / RESOLUTION));
  const peaks = new Float64Array(RESOLUTION);
  let loudest = 0;

  for (let bucket = 0; bucket < RESOLUTION; bucket++) {
    const start = bucket * bucketSize;
    const end = Math.min(samples.length, start + bucketSize);
    let peak = 0;

    for (let i = start; i < end; i++) {
      const amplitude = Math.abs(samples[i]);
      if (amplitude > peak) peak = amplitude;
    }

    peaks[bucket] = peak;
    if (peak > loudest) loudest = peak;
  }

  const quantized = new Uint8Array(RESOLUTION);
  if (loudest > 0) {
    for (let i = 0; i < RESOLUTION; i++) {
      quantized[i] = Math.round((peaks[i] / loudest) * 255);
    }
  }

  return Buffer.from(quantized).toString('base64');
}

async function processTrack(key, index, total) {
  const tempFile = join(
    tmpdir(),
    `peaks-${process.pid}-${index}-${key.replace(/[^a-z0-9]/gi, '_').slice(-60)}`
  );

  try {
    await downloadToFile(key, tempFile);
    const samples = await decodeToPcm(tempFile);

    if (samples.length === 0) {
      throw new Error('decoded to zero samples');
    }

    const entry = {
      peaks: computePeaks(samples),
      duration: Number((samples.length / SAMPLE_RATE).toFixed(2)),
    };

    console.log(`  [${index + 1}/${total}] ${key} — ${entry.duration}s`);
    return [key, entry];
  } finally {
    await rm(tempFile, { force: true });
  }
}

async function main() {
  console.log(`Listing tracks in s3://${BUCKET}/tracks/ ...`);
  const keys = await listTrackKeys();

  if (keys.length === 0) {
    console.error('No tracks found — nothing to do.');
    process.exit(1);
  }

  console.log(`Found ${keys.length} track(s). Decoding with ffmpeg ...`);

  const entries = [];
  const failures = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < keys.length) {
      const index = cursor++;
      const key = keys[index];
      try {
        entries.push(await processTrack(key, index, keys.length));
      } catch (error) {
        failures.push(key);
        console.error(`  [${index + 1}/${keys.length}] ${key} — FAILED: ${error.message}`);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, keys.length) }, worker)
  );

  entries.sort(([a], [b]) => a.localeCompare(b));

  const output = {
    version: 1,
    resolution: RESOLUTION,
    generatedAt: new Date().toISOString(),
    tracks: Object.fromEntries(entries),
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`\nWrote ${entries.length} track(s) to ${OUTPUT_PATH}`);
  if (failures.length > 0) {
    console.error(`${failures.length} track(s) failed:`);
    failures.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
