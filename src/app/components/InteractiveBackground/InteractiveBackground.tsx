'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface InteractiveBackgroundProps {
  className?: string;
  variant?: 'shapes' | 'grid' | 'particles' | 'constellation';
  intensity?: number;
  color?: string;
  count?: number;
  speed?: number;
  size?: number;
  interactive?: boolean;
  disabled?: boolean;
}

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  type: 'circle' | 'square' | 'triangle' | 'diamond';
  vx: number;
  vy: number;
  color: string;
}

const InteractiveBackground = ({
  className = '',
  variant = 'shapes',
  intensity = 0.5,
  color = '#2fbf71',
  count = 15,
  speed = 0.5,
  size = 40,
  interactive = true,
  disabled = false,
}: InteractiveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const shapesRef = useRef<Shape[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize shapes when canvas has proper dimensions
  useEffect(() => {
    if (disabled || dimensions.width === 0 || dimensions.height === 0) return;

    const shapes: Shape[] = [];
    const shapeTypes: Shape['type'][] = [
      'circle',
      'square',
      'triangle',
      'diamond',
    ];
    const colors = [color, `${color}80`, `${color}60`, `${color}40`];

    for (let i = 0; i < count; i++) {
      shapes.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * size + 10,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.5,
        type:
          shapeTypes[Math.floor(Math.random() * shapeTypes.length)] || 'circle',
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        color: colors[Math.floor(Math.random() * colors.length)] || color,
      });
    }

    shapesRef.current = shapes;
  }, [
    disabled,
    count,
    color,
    size,
    speed,
    dimensions.width,
    dimensions.height,
  ]);

  // Handle mouse movement
  useEffect(() => {
    if (disabled || !interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disabled, interactive]);

  // Drawing functions - memoized to avoid dependency issues
  const drawShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = shape.color;

      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(
            -shape.size / 2,
            -shape.size / 2,
            shape.size,
            shape.size
          );
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, 0);
          ctx.lineTo(0, shape.size / 2);
          ctx.lineTo(-shape.size / 2, 0);
          ctx.closePath();
          ctx.fill();
          break;
      }
    },
    []
  );

  const drawGridDot = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      ctx.fillStyle = shape.color;
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 8, 0, Math.PI * 2);
      ctx.fill();
    },
    []
  );

  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      ctx.fillStyle = shape.color;
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 6, 0, Math.PI * 2);
      ctx.fill();
    },
    []
  );

  const drawStar = useCallback(
    (ctx: CanvasRenderingContext2D, shape: Shape) => {
      ctx.fillStyle = shape.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = shape.color;
      ctx.beginPath();

      const spikes = 5;
      const outerRadius = shape.size / 2;
      const innerRadius = outerRadius * 0.5;

      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i / (spikes * 2)) * Math.PI * 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();
    },
    []
  );

  const drawConnections = useCallback(
    (ctx: CanvasRenderingContext2D, shapes: Shape[]) => {
      // Convert color to rgba for connection lines
      const colorToRgba = (colorStr: string, alpha: number) => {
        // Validate alpha
        const validAlpha = Math.max(0, Math.min(1, alpha));

        // Handle different color formats
        if (!colorStr || typeof colorStr !== 'string') {
          return `rgba(47, 191, 113, ${validAlpha})`; // fallback to theme color
        }

        // Handle rgba/rgb format
        if (colorStr.startsWith('rgba(') || colorStr.startsWith('rgb(')) {
          const match = colorStr.match(/rgba?\(([^)]+)\)/);
          if (match && match[1]) {
            const parts = match[1].split(',').map((p) => p.trim());
            if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
              const r = parseInt(parts[0]);
              const g = parseInt(parts[1]);
              const b = parseInt(parts[2]);
              if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
              }
            }
          }
        }

        // Handle hex format
        if (colorStr.startsWith('#')) {
          let cleanHex = colorStr.replace('#', '');

          // Handle 3-digit hex codes (e.g., #f0a -> #ff00aa)
          if (cleanHex.length === 3) {
            cleanHex = cleanHex
              .split('')
              .map((char) => char + char)
              .join('');
          }

          // Validate 6-digit hex format
          if (cleanHex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
            const r = parseInt(cleanHex.slice(0, 2), 16);
            const g = parseInt(cleanHex.slice(2, 4), 16);
            const b = parseInt(cleanHex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
          }
        }

        // Fallback to theme color
        return `rgba(47, 191, 113, ${validAlpha})`;
      };

      const connectionColor = colorToRgba(color, 0.3);
      ctx.strokeStyle = connectionColor;
      ctx.lineWidth = 2;

      // Save the current context state
      ctx.save();

      shapes.forEach((shape, i) => {
        shapes.slice(i + 1).forEach((otherShape) => {
          const dx = shape.x - otherShape.x;
          const dy = shape.y - otherShape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(otherShape.x, otherShape.y);
            ctx.globalAlpha = ((150 - distance) / 150) * 0.5;
            ctx.stroke();
          }
        });
      });

      // Restore the context state to prevent affecting subsequent operations
      ctx.restore();
    },
    [color]
  );

  // Animation loop
  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += 0.5;

        // Bounce off edges - account for shape size and clamp position
        const radius = shape.size / 2;

        if (shape.x - radius <= 0) {
          shape.x = radius; // Clamp to boundary
          shape.vx = Math.abs(shape.vx); // Ensure velocity points inward
        } else if (shape.x + radius >= canvas.width) {
          shape.x = canvas.width - radius; // Clamp to boundary
          shape.vx = -Math.abs(shape.vx); // Ensure velocity points inward
        }

        if (shape.y - radius <= 0) {
          shape.y = radius; // Clamp to boundary
          shape.vy = Math.abs(shape.vy); // Ensure velocity points inward
        } else if (shape.y + radius >= canvas.height) {
          shape.y = canvas.height - radius; // Clamp to boundary
          shape.vy = -Math.abs(shape.vy); // Ensure velocity points inward
        }

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - shape.x;
          const dy = mouseRef.current.y - shape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            shape.x -= dx * force * 0.02 * intensity;
            shape.y -= dy * force * 0.02 * intensity;
          }
        }

        // Draw shape
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate((shape.rotation * Math.PI) / 180);
        ctx.globalAlpha = shape.opacity;

        switch (variant) {
          case 'shapes':
            drawShape(ctx, shape);
            break;
          case 'grid':
            drawGridDot(ctx, shape);
            break;
          case 'particles':
            drawParticle(ctx, shape);
            break;
          case 'constellation':
            drawStar(ctx, shape);
            break;
        }

        ctx.restore();

        // Reset shadow for next shape
        ctx.shadowBlur = 0;
      });

      // Draw connections for constellation variant
      if (variant === 'constellation') {
        drawConnections(ctx, shapesRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    disabled,
    variant,
    interactive,
    intensity,
    drawShape,
    drawGridDot,
    drawParticle,
    drawStar,
    drawConnections,
  ]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setDimensions({ width: rect.width, height: rect.height });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (disabled) return null;

  return (
    <motion.div
      className={`interactive-background ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        className='interactive-background-canvas'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        width={dimensions.width}
        height={dimensions.height}
      />
    </motion.div>
  );
};

export default InteractiveBackground;
