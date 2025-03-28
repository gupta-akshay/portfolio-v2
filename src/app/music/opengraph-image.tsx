import { ImageResponse } from 'next/og';

export const alt = 'Akshay Gupta Music';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px 80px',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 20 }}>
          My Music
        </div>
        <div style={{ fontSize: 36, textAlign: 'center', color: '#cccccc' }}>
          Listen to my latest remixes and productions
        </div>
        <div style={{ fontSize: 24, marginTop: 40, color: '#999999' }}>
          akshaygupta.live/music
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
