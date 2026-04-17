import { NextResponse } from 'next/server';
import { getAudioFilesList } from '@/app/utils/aws';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tracks = await getAudioFilesList();
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
