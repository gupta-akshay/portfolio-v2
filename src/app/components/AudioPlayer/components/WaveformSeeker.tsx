'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { formatTime, decodePeaks } from '../utils';
import styles from '../AudioPlayer.module.scss';

// Flat placeholder for a track uploaded since the last `pnpm peaks:generate`
// run. It reads as an unanalysed strip rather than faking an envelope.
const FALLBACK_PEAKS = new Array<number>(400).fill(0.5);
const BAR_GAP = 1.5;

// Canvas can't read Sass tokens, so the accent is mirrored here.
// Keep in sync with $px-theme in src/app/styles/variables.scss.
const ACCENT = '#fbbf24';
const ACCENT_HOVER = 'rgba(251, 191, 36, 0.45)';
const ACCENT_REFLECT = 'rgba(251, 191, 36, 0.35)';
const ACCENT_REFLECT_HOVER = 'rgba(251, 191, 36, 0.18)';

interface WaveformSeekerProps {
  /** Base64 peak data precomputed from the real audio */
  peaks: string | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  /** `row` is the tall expanded seeker, `bar` the slim strip on the player bar */
  variant: 'row' | 'bar';
  label: string;
}

// The expanded row sits on the amber accent slab, so it needs dark bars;
// the player bar sits on the page surface and uses the accent itself.
const ON_ACCENT = {
  played: '#0b0b10',
  hover: 'rgba(11, 11, 16, 0.45)',
  idle: 'rgba(11, 11, 16, 0.25)',
  reflect: 'rgba(11, 11, 16, 0.35)',
  reflectHover: 'rgba(11, 11, 16, 0.18)',
  reflectIdle: 'rgba(11, 11, 16, 0.12)',
};

// Chunkier bars than the previous design — the waveform reads as blocks
const VARIANTS = {
  row: { barWidth: 4, reflect: true, showTooltip: true },
  bar: { barWidth: 3, reflect: false, showTooltip: false },
} as const;

const WaveformSeeker: React.FC<WaveformSeekerProps> = ({
  peaks,
  currentTime,
  duration,
  onSeek,
  variant,
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScrubbingRef = useRef(false);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const { isLightMode } = useTheme();

  const { barWidth, reflect, showTooltip } = VARIANTS[variant];
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const decoded = peaks ? decodePeaks(peaks) : [];
    const amplitudes = decoded.length ? decoded : FALLBACK_PEAKS;

    const barCount = Math.floor(width / (barWidth + BAR_GAP));
    if (barCount <= 0) return;

    // Reflection mirrors the top 68% of the canvas, SoundCloud style
    const mainHeight = reflect ? height * 0.68 : height;
    const reflectionHeight = height - mainHeight;

    const onAccent = variant === 'row';

    const playedColor = onAccent ? ON_ACCENT.played : ACCENT;
    const hoverColor = onAccent ? ON_ACCENT.hover : ACCENT_HOVER;
    const playedReflect = onAccent ? ON_ACCENT.reflect : ACCENT_REFLECT;
    const hoverReflect = onAccent
      ? ON_ACCENT.reflectHover
      : ACCENT_REFLECT_HOVER;

    const idleColor = onAccent
      ? ON_ACCENT.idle
      : isLightMode
        ? 'rgba(11, 11, 19, 0.22)'
        : 'rgba(255, 255, 255, 0.22)';
    const idleReflectionColor = onAccent
      ? ON_ACCENT.reflectIdle
      : isLightMode
        ? 'rgba(11, 11, 19, 0.09)'
        : 'rgba(255, 255, 255, 0.09)';

    for (let i = 0; i < barCount; i++) {
      const peak =
        amplitudes[Math.floor((i * amplitudes.length) / barCount)] ?? 0.08;
      const x = i * (barWidth + BAR_GAP);
      const ratio = i / barCount;
      const isPlayed = ratio <= progress;
      const isHovered = hoverRatio !== null && ratio <= hoverRatio;

      ctx.fillStyle = isPlayed
        ? playedColor
        : isHovered
          ? hoverColor
          : idleColor;

      const barHeight = Math.max(2, peak * (mainHeight - 2));
      ctx.fillRect(x, mainHeight - barHeight, barWidth, barHeight);

      if (reflect) {
        ctx.fillStyle = isPlayed
          ? playedReflect
          : isHovered
            ? hoverReflect
            : idleReflectionColor;
        ctx.fillRect(
          x,
          mainHeight + 2,
          barWidth,
          Math.max(1, peak * (reflectionHeight - 2) * 0.8)
        );
      }
    }
  }, [
    peaks,
    barWidth,
    reflect,
    variant,
    progress,
    hoverRatio,
    isLightMode,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Redraw when the canvas is resized (viewport changes, queue drawer, etc.)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const ratioFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return null;
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const seekTo = (ratio: number | null) => {
    if (ratio === null || !Number.isFinite(duration) || duration <= 0) return;
    onSeek(ratio * duration);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    isScrubbingRef.current = true;
    const ratio = ratioFromEvent(e);
    setHoverRatio(ratio);
    seekTo(ratio);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ratio = ratioFromEvent(e);
    setHoverRatio(ratio);
    if (isScrubbingRef.current) seekTo(ratio);
  };

  const endScrub = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScrubbingRef.current) return;
    isScrubbingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handlePointerLeave = () => {
    if (isScrubbingRef.current) return;
    setHoverRatio(null);
  };

  return (
    <div className={styles.seeker} data-variant={variant}>
      <canvas
        ref={canvasRef}
        className={styles.seekerCanvas}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        onPointerLeave={handlePointerLeave}
        aria-hidden='true'
      />
      {showTooltip && hoverRatio !== null && (
        <div
          className={styles.seekerTooltip}
          style={{ left: `${(hoverRatio * 100).toFixed(1)}%` }}
        >
          {formatTime(hoverRatio * duration)}
        </div>
      )}
      {/* Keyboard/screen-reader accessible equivalent of the canvas scrubber.
          Living in an <input> also keeps the global arrow-key shortcuts from
          hijacking seek while it is focused. */}
      <input
        type='range'
        className={styles.seekerSlider}
        min={0}
        max={Number.isFinite(duration) && duration > 0 ? duration : 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
      />
    </div>
  );
};

export default WaveformSeeker;
