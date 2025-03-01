import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Akshay Gupta - Full-Stack Web Developer';
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
          Akshay Gupta
        </div>
        <div style={{ fontSize: 36, textAlign: 'center' }}>
          Senior Staff Engineer at PeopleGrove
        </div>
        <div style={{ fontSize: 28, marginTop: 20, color: '#cccccc' }}>
          Full-Stack Web Developer
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
