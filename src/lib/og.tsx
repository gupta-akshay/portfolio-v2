import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Every route's opengraph-image renders the same neo-brutalist slab: flat ink
// canvas, a bordered card sitting on a hard white offset shadow, an amber label
// chip up top and a mono footer rule. Only the copy differs.
export const OG_SIZE = { width: 1200, height: 630 };

// Satori cannot read the next/font woff2s, so the card ships its own static TTF
// instances of the same two families. Read from disk rather than
// `fetch(new URL(…, import.meta.url))` — Turbopack does not implement that for
// local assets and the build dies on it. `outputFileTracingIncludes` in
// next.config.mjs keeps the directory next to the serverless bundle.
const fontFile = (name: string) =>
  readFileSync(join(process.cwd(), 'src/lib/fonts', `${name}.ttf`));

// Read once per module, not per render
const fonts = [
  { name: 'Space Grotesk', data: fontFile('SpaceGrotesk-500'), weight: 500 },
  { name: 'Space Grotesk', data: fontFile('SpaceGrotesk-700'), weight: 700 },
  { name: 'Space Mono', data: fontFile('SpaceMono-400'), weight: 400 },
  { name: 'Space Mono', data: fontFile('SpaceMono-700'), weight: 700 },
] as const;

interface OgCard {
  title: string;
  subtitle?: string;
  /** Third line, dimmer than the subtitle */
  note?: string;
  footer: string;
  /** Chip text. Defaults to the footer's path segment — /blog renders BLOG */
  label?: string;
}

export async function renderOg({
  title,
  subtitle,
  note,
  footer,
  label = footer.split('/')[1]?.toUpperCase() || 'HOME',
}: OgCard) {
  // Long article titles have to give way rather than crowd the footer rule
  const titleSize = title.length > 80 ? 40 : title.length > 55 ? 48 : 60;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: '#0b0b10',
        fontFamily: 'Space Grotesk',
      }}
    >
      {/* The hard offset shadow — solid, never blurred, white on the dark canvas */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 50,
          width: 1120,
          height: 550,
          background: '#ffffff',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 40,
          width: 1120,
          height: 550,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          background: '#14141c',
          border: '3px solid #ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '8px 16px',
            background: '#fbbf24',
            color: '#000000',
            border: '2px solid #ffffff',
            boxShadow: '4px 4px 0 #ffffff',
            fontFamily: 'Space Mono',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.12em',
          }}
        >
          {label}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                fontSize: 30,
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'rgba(255, 255, 255, 0.72)',
              }}
            >
              {subtitle}
            </div>
          )}

          {note && (
            <div
              style={{
                display: 'flex',
                marginTop: 16,
                fontFamily: 'Space Mono',
                fontSize: 22,
                lineHeight: 1.4,
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {note}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 24,
            borderTop: '2px solid rgba(255, 255, 255, 0.35)',
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: '#fbbf24',
              border: '2px solid #ffffff',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontFamily: 'Space Mono',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#fbbf24',
            }}
          >
            {footer.toUpperCase()}
          </div>
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: [...fonts] }
  );
}
