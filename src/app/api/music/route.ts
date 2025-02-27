import { NextResponse } from 'next/server';
import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
  accessToken: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
  fetch: global.fetch,
});

export async function GET() {
  try {
    const response = await dbx.filesListFolder({
      path: '',
      recursive: true,
    });

    const audioFiles = response.result.entries
      .filter(
        (entry) =>
          entry['.tag'] === 'file' &&
          (entry.name.endsWith('.mp3') || entry.name.endsWith('.wav'))
      )
      .map((file) => {
        // Parse filename: [Year][Original Artist][Name][Type][Artist].mp3
        const fileName = file.name.replace(/\.(mp3|wav)$/, '');
        const matches = fileName.match(/\[(.*?)\]/g) || [];
        const parts = matches.map((m) => m.slice(1, -1)); // Remove brackets

        const year = parseInt(parts[0], 10) || 9999;
        const originalArtist = parts[1] || '';
        const name = parts[2] || '';
        const type = parts[3] || '';
        const artist = parts[4] || 'A-Shay';

        // Format title based on whether original artist exists
        const title =
          originalArtist.trim().length > 0
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

    return NextResponse.json(audioFiles);
  } catch (error) {
    console.error('Error listing audio files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio files' },
      { status: 500 }
    );
  }
}
