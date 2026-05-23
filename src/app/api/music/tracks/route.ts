import { NextResponse } from 'next/server';
import { getAudioFilesList } from '@/app/utils/aws';
import { logger } from '@/app/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tracks = await getAudioFilesList();
    return NextResponse.json(tracks, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    logger.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
