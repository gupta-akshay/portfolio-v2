#!/usr/bin/env node
// Convert every .jpg / .jpeg / .png / .avif under public/images/ to .webp.
// Keeps the originals so a subsequent git step can remove them deliberately.

import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = join(process.cwd(), 'public', 'images');
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.avif']);

// Per-format quality tuned empirically: photos stay ~85, near-lossless for
// source PNGs that are likely UI/logos so we preserve sharp edges.
const QUALITY = {
  photo: 85,
  ui: 90,
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function isUiAsset(file) {
  const name = basename(file).toLowerCase();
  return (
    name.includes('logo') ||
    name.includes('author') ||
    name.includes('avatar') ||
    name.includes('peoplegrove') ||
    name.includes('email-header')
  );
}

const args = new Set(process.argv.slice(2));
const DELETE_ORIGINALS = args.has('--delete');

let converted = 0;
let skipped = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;

  const outFile = join(dirname(file), basename(file, ext) + '.webp');

  const { size: srcSize } = await stat(file);
  bytesBefore += srcSize;

  const quality = isUiAsset(file) ? QUALITY.ui : QUALITY.photo;

  const pipeline = sharp(file, { animated: false }).webp({
    quality,
    effort: 6,
    smartSubsample: true,
  });

  await pipeline.toFile(outFile);

  const { size: outSize } = await stat(outFile);
  bytesAfter += outSize;

  const delta = (((outSize - srcSize) / srcSize) * 100).toFixed(1);
  console.log(
    `${file.replace(process.cwd() + '/', '')} -> ${basename(outFile)}  ` +
      `${(srcSize / 1024).toFixed(1)} KB -> ${(outSize / 1024).toFixed(1)} KB (${delta}%)`
  );
  converted++;

  if (DELETE_ORIGINALS) {
    await unlink(file);
  } else {
    skipped++;
  }
}

console.log('');
console.log(
  `Converted ${converted} file(s). ` +
    `Total ${(bytesBefore / 1024).toFixed(1)} KB -> ${(bytesAfter / 1024).toFixed(1)} KB ` +
    `(${(((bytesAfter - bytesBefore) / bytesBefore) * 100).toFixed(1)}% change)`
);
if (!DELETE_ORIGINALS) {
  console.log(`Re-run with --delete to remove the ${skipped} original file(s).`);
}
