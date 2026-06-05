import { ImageResponse } from 'next/og';

export const alt = 'Resume — Akshay Gupta, Senior Staff Engineer';
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
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 24,
            background: 'linear-gradient(90deg, #2fbf71, #00d4aa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
          }}
        >
          Resume
        </div>
        <div
          style={{
            fontSize: 36,
            textAlign: 'center',
            color: '#e0e0e0',
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Akshay Gupta
        </div>
        <div
          style={{
            fontSize: 24,
            textAlign: 'center',
            color: '#aaaaaa',
            marginBottom: 40,
          }}
        >
          Senior Staff Engineer · 8+ Years Experience
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#2fbf71',
            fontWeight: 500,
          }}
        >
          akshaygupta.live/resume
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
