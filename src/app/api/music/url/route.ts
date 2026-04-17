import { NextRequest, NextResponse } from 'next/server';
import { getAudioUrl } from '@/app/utils/aws';

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json() as { path: string };

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const url = await getAudioUrl(path);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
