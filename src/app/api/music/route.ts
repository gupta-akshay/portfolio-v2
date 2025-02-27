import { NextResponse } from 'next/server';
import { Dropbox, DropboxResponse, files, users } from 'dropbox';

interface DropboxError {
  status: number;
  message: string;
}

const dbx = new Dropbox({
  accessToken: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
  fetch: global.fetch,
});

export async function GET() {
  console.log('🎵 Music API route called');
  console.log('Token available:', !!process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN);

  try {
    // Test Dropbox connection
    console.log('Testing Dropbox connection...');
    try {
      const testResponse = await dbx.checkUser({});
      const userInfo = testResponse.result as users.FullAccount;
      console.log('Dropbox connection successful:', userInfo.email);
    } catch (err) {
      const error = err as DropboxError;
      console.error('Dropbox connection test failed:', error);
      return NextResponse.json(
        { error: 'Failed to connect to Dropbox', details: error.message },
        { status: 500 }
      );
    }

    // List files
    console.log('Listing audio files...');
    const response = await dbx.filesListFolder({
      path: '',
      recursive: true,
    });

    console.log('Files found:', response.result.entries.length);

    // Filter and process audio files
    const audioFiles = response.result.entries
      .filter((entry) => {
        const isAudioFile = entry['.tag'] === 'file' &&
          (entry.name.endsWith('.mp3') || entry.name.endsWith('.wav'));
        if (isAudioFile) {
          console.log('Found audio file:', entry.name, 'at path:', entry.path_display);
        }
        return isAudioFile;
      })
      .map((file) => {
        // Parse filename
        const fileName = file.name.replace(/\.(mp3|wav)$/, '');
        const matches = fileName.match(/\[(.*?)\]/g) || [];
        const parts = matches.map((m) => m.slice(1, -1));

        console.log('Processing file:', {
          name: file.name,
          parts: parts,
          path: file.path_display
        });

        const year = parseInt(parts[0], 10) || 9999;
        const originalArtist = parts[1] || '';
        const name = parts[2] || '';
        const type = parts[3] || '';
        const artist = parts[4] || 'A-Shay';

        const title = originalArtist.trim().length > 0
          ? `${originalArtist}: ${name} - ${type}`
          : `${name} - ${type}`;

        return {
          id: file.path_display || '',
          title: title.trim(),
          artist: artist,
          path: file.path_lower || '',
          year: year,
        };
      })
      .sort((a, b) => b.year - a.year);

    console.log('Processed audio files:', audioFiles.length);
    
    if (audioFiles.length === 0) {
      console.log('No audio files found. Check file naming and permissions.');
    } else {
      console.log('First audio file:', JSON.stringify(audioFiles[0], null, 2));
    }

    return NextResponse.json(audioFiles);
  } catch (err) {
    const error = err as DropboxError;
    console.error('Error in music API route:', {
      message: error.message,
      stack: error instanceof Error ? error.stack : undefined,
      error
    });

    // Determine if it's a Dropbox API error
    if (error.status) {
      return NextResponse.json({
        error: 'Dropbox API error',
        status: error.status,
        details: error.message
      }, { status: error.status });
    }

    return NextResponse.json(
      { error: 'Failed to fetch audio files', details: error.message },
      { status: 500 }
    );
  }
}
