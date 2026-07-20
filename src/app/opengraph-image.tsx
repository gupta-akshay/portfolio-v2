import { ImageResponse } from 'next/og';
import { getYearsOfExperience } from '@/app/utils/helpers/format';

export const alt = 'Akshay Gupta - Senior Staff Engineer at PeopleGrove';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 80px',
        background: 'linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: 'center',
          color: '#ffffff',
          marginBottom: 24,
        }}
      >
        Akshay Gupta
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 38,
          lineHeight: 1.2,
          textAlign: 'center',
          color: '#2fbf71',
          marginBottom: 20,
        }}
      >
        Senior Staff Engineer
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 25,
          lineHeight: 1.4,
          textAlign: 'center',
          color: '#d0d0d0',
          marginBottom: 42,
        }}
      >
        {`${getYearsOfExperience()}+ years building reliable web platforms and products`}
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          color: '#2fbf71',
          fontWeight: 500,
        }}
      >
        akshaygupta.live
      </div>
    </div>,
    { ...size }
  );
}
