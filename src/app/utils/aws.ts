import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCloudfrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Track } from '@/app/components/AudioPlayer/types';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '';
const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || '';
const CLOUDFRONT_KEY_PAIR_ID = process.env.NEXT_PUBLIC_CLOUDFRONT_KEY_PAIR_ID || '';
const CLOUDFRONT_PRIVATE_KEY = process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY || '';

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
    year: parseInt(parts[0], 10) || 9999,
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
      Prefix: 'tracks/', // Assuming tracks are stored in a 'tracks' folder
    });

    const response = await s3Client.send(command);
    if (!response.Contents) return [];

    const tracks: Track[] = response.Contents
      .filter((item) => item.Key && /\.(mp3|wav)$/i.test(item.Key))
      .map((item) => {
        const metadata = parseTrackMetadata(item.Key || '');
        
        return {
          id: item.Key || '',
          title: formatTrackTitle(metadata),
          artist: metadata.artist,
          path: item.Key || '',
          year: metadata.year,
        };
      })
      .sort((a, b) => b.year - a.year);

    return tracks;
  } catch (error) {
    console.error('Error fetching audio files from S3:', error);
    throw error;
  }
}

/**
 * Get a signed URL for the audio file
 * If CloudFront is configured, returns a CloudFront signed URL
 * Otherwise, returns an S3 pre-signed URL
 */
export async function getAudioUrl(path: string): Promise<string> {
  try {
    // Only use CloudFront if ALL required config is present and valid
    if (
      CLOUDFRONT_DOMAIN &&
      CLOUDFRONT_KEY_PAIR_ID &&
      CLOUDFRONT_PRIVATE_KEY &&
      CLOUDFRONT_PRIVATE_KEY.length > 0
    ) {
      try {
        // Decode base64 private key if needed
        let privateKey = CLOUDFRONT_PRIVATE_KEY;
        if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        }

        // Ensure the CloudFront domain doesn't include the protocol
        const cleanDomain = CLOUDFRONT_DOMAIN.replace(/^https?:\/\//, '');
        
        const url = `https://${cleanDomain}/${path}`;
        return getCloudfrontSignedUrl({
          url,
          keyPairId: CLOUDFRONT_KEY_PAIR_ID,
          privateKey: privateKey,
          dateLessThan: new Date(Date.now() + 3600 * 1000).toISOString(), // URL expires in 1 hour
        });
      } catch (cloudfrontError) {
        console.error('Error getting URL:', cloudfrontError);
      }
    }

    console.log('Using Fallback URL');
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
  } catch (error) {
    console.error('Error getting audio URL:', error);
    throw error;
  }
} 