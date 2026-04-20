import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Track } from '@/app/types';
import { serverEnv } from '@/env';
import { logger } from '@/app/utils/logger';

const s3Client = new S3Client({
  region: serverEnv.AWS_REGION,
  credentials: {
    accessKeyId: serverEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: serverEnv.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = serverEnv.AWS_BUCKET_NAME;

/**
 * Parse track metadata from the file key
 * Format: [year][original artist][name][type][artist].mp3
 */
const parseTrackMetadata = (fileKey: string) => {
  const fileName = fileKey.split('/').pop() || '';
  const cleanFileName = fileName.replace(/\.(mp3|wav)$/, '');
  const matches = cleanFileName.match(/\[(.*?)\]/g) || [];
  const parts = matches.map((m) => m.slice(1, -1));

  return {
    year: parseInt(parts[0] || '9999', 10),
    originalArtist: parts[1] || '',
    name: parts[2] || '',
    type: parts[3] || '',
    artist: parts[4] || 'A-Shay',
  };
};

/**
 * Format track title based on metadata
 */
const formatTrackTitle = (metadata: {
  originalArtist: string;
  name: string;
  type: string;
}): string => {
  const { originalArtist, name, type } = metadata;
  const typeString = type.trim().length > 0 ? ` - ${type}` : '';

  return originalArtist.trim().length > 0
    ? `${originalArtist}: ${name}${typeString}`
    : `${name}${typeString}`;
};

/**
 * List all audio tracks from S3 bucket
 */
export async function getAudioFilesList(): Promise<Track[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'tracks/',
    });

    const response = await s3Client.send(command);
    if (!response.Contents) return [];

    const tracks: Track[] = response.Contents.filter(
      (item) => item.Key && /\.(mp3|wav)$/i.test(item.Key)
    )
      .map((item) => {
        const metadata = parseTrackMetadata(item.Key || '');
        const title = formatTrackTitle(metadata);

        return {
          id: item.Key || '',
          title: title,
          artist: metadata.artist,
          path: item.Key || '',
          year: metadata.year,
          originalArtist: metadata.originalArtist,
          name: metadata.name,
          type: metadata.type,
        };
      })
      .sort((a, b) => b.year - a.year);

    return tracks;
  } catch (error) {
    logger.error('Error fetching audio files from S3:', error);
    throw error;
  }
}

/**
 * Get a signed URL for the audio file
 * If CloudFront is configured, returns a CloudFront signed URL
 * Otherwise, returns an S3 pre-signed URL
 */
export async function getAudioUrl(path: string): Promise<string> {
  const cloudfrontDomain = serverEnv.CLOUDFRONT_DOMAIN;
  const cloudfrontKeyPairId = serverEnv.CLOUDFRONT_KEY_PAIR_ID;
  const cloudfrontPrivateKey = serverEnv.CLOUDFRONT_PRIVATE_KEY;

  try {
    if (cloudfrontDomain && cloudfrontKeyPairId && cloudfrontPrivateKey) {
      try {
        let privateKey = cloudfrontPrivateKey;
        if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        }

        const cleanDomain = cloudfrontDomain.replace(/^https?:\/\//, '');
        const url = `https://${cleanDomain}/${path}`;

        return getCloudfrontSignedUrl({
          url,
          keyPairId: cloudfrontKeyPairId,
          privateKey: privateKey,
          dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString(),
        });
      } catch (cloudfrontError) {
        logger.error('Error getting CloudFront URL:', cloudfrontError);
      }
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      ResponseContentDisposition: 'inline',
    });

    return await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
  } catch (error) {
    logger.error('Error getting audio URL:', error);
    throw error;
  }
}
