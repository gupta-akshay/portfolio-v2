import { ImageResponse } from 'next/og';

// Every route's opengraph-image renders the same card: dark gradient canvas,
// system font stack, amber footer. Only the copy and the alignment differ.
export const OG_SIZE = { width: 1200, height: 630 };

interface OgCard {
  title: string;
  subtitle?: string;
  /** Third line, dimmer than the subtitle */
  note?: string;
  footer: string;
  /** Article cards stack their copy in the bottom-left corner */
  align?: 'center' | 'bottom-left';
  /** The home card uses flat white; everything else uses the amber/violet fill */
  plainTitle?: boolean;
  subtitleColor?: string;
}

export function renderOg({
  title,
  subtitle,
  note,
  footer,
  align = 'center',
  plainTitle = false,
  subtitleColor = '#e0e0e0',
}: OgCard) {
  const centered = align === 'center';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        justifyContent: centered ? 'center' : 'flex-end',
        padding: '60px 80px',
        background: 'linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: centered ? 72 : 56,
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: centered ? '100%' : '85%',
          textAlign: centered ? 'center' : 'left',
          ...(plainTitle
            ? { color: '#ffffff' }
            : {
                background: 'linear-gradient(90deg, #fbbf24, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }),
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            display: 'flex',
            fontSize: centered ? 36 : 28,
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: '90%',
            textAlign: centered ? 'center' : 'left',
            color: subtitleColor,
          }}
        >
          {subtitle}
        </div>
      )}

      {note && (
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            lineHeight: 1.4,
            marginBottom: 32,
            textAlign: centered ? 'center' : 'left',
            color: '#aaaaaa',
          }}
        >
          {note}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          fontSize: 24,
          color: '#fbbf24',
          fontWeight: 500,
        }}
      >
        {footer}
      </div>
    </div>,
    OG_SIZE
  );
}
