import { NextRequest, NextResponse } from 'next/server';
import { getAudioUrl } from '@/app/utils/aws';

const ALLOWED_PREFIX = 'tracks/';
const ALLOWED_EXTENSIONS = /\.(mp3|wav)$/i;

function isAllowedPath(path: string): boolean {
  return (
    typeof path === 'string' &&
    path.startsWith(ALLOWED_PREFIX) &&
    ALLOWED_EXTENSIONS.test(path) &&
    !path.includes('..') &&
    !path.includes('\0')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { path?: unknown };
    const { path } = body;

    if (!path || !isAllowedPath(path as string)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const url = await getAudioUrl(path as string);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
