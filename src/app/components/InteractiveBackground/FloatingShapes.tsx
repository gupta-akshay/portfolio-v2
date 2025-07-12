'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'motion/react';

interface FloatingShapesProps {
  children?: ReactNode;
  className?: string;
  count?: number;
  size?: number;
  color?: string;
  speed?: number;
  shapes?: ('circle' | 'square' | 'triangle' | 'diamond')[];
  disabled?: boolean;
}

interface FloatingShape {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'square' | 'triangle' | 'diamond';
  opacity: number;
  color: string;
}

const FloatingShapes = ({
  children,
  className = '',
  count = 8,
  size = 40,
  color = '#2fbf71',
  speed = 20,
  shapes = ['circle', 'square', 'triangle', 'diamond'],
  disabled = false,
}: FloatingShapesProps) => {
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    if (disabled) return;

    const newShapes: FloatingShape[] = [];
    // Convert hex to rgba format for opacity variations
    const hexToRgba = (hex: string, alpha: number) => {
      // Validate alpha
      const validAlpha = Math.max(0, Math.min(1, alpha));

      // Handle different color formats
      if (!hex || typeof hex !== 'string') {
        return `rgba(47, 191, 113, ${validAlpha})`; // fallback to theme color
      }

      // Remove # if present
      let cleanHex = hex.replace('#', '');

      // Handle 3-digit hex codes (e.g., #f0a -> #ff00aa)
      if (cleanHex.length === 3) {
        cleanHex = cleanHex
          .split('')
          .map((char) => char + char)
          .join('');
      }

      // Validate 6-digit hex format
      if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        return `rgba(47, 191, 113, ${validAlpha})`; // fallback to theme color
      }

      const r = parseInt(cleanHex.slice(0, 2), 16);
      const g = parseInt(cleanHex.slice(2, 4), 16);
      const b = parseInt(cleanHex.slice(4, 6), 16);

      return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
    };

    const colors = [
      color,
      hexToRgba(color, 0.8),
      hexToRgba(color, 0.6),
      hexToRgba(color, 0.4),
    ];

    for (let i = 0; i < count; i++) {
      newShapes.push({
        id: i,
        size: Math.random() * size + 30, // Increased minimum size
        x: Math.random() * 80 + 10, // Keep shapes away from edges
        y: Math.random() * 80 + 10, // Keep shapes away from edges
        delay: Math.random() * 5,
        duration: Math.random() * speed + 15, // Slower animation
        shape: shapes[Math.floor(Math.random() * shapes.length)] || 'circle',
        opacity: Math.random() * 0.4 + 0.3, // More visible opacity
        color: colors[Math.floor(Math.random() * colors.length)] || color,
      });
    }

    setFloatingShapes(newShapes);
  }, [disabled, count, size, color, speed, shapes]);

  const getShapeElement = (shape: FloatingShape) => {
    const shapeStyle = {
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      backgroundColor: shape.color,
      opacity: shape.opacity,
    };

    switch (shape.shape) {
      case 'circle':
        return (
          <div
            className='floating-shape-circle'
            style={{
              ...shapeStyle,
              borderRadius: '50%',
            }}
          />
        );
      case 'square':
        return <div className='floating-shape-square' style={shapeStyle} />;
      case 'triangle':
        return (
          <div
            className='floating-shape-triangle'
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              opacity: shape.opacity,
            }}
          />
        );
      case 'diamond':
        return (
          <div
            className='floating-shape-diamond'
            style={{
              ...shapeStyle,
              transform: 'rotate(45deg)',
            }}
          />
        );
      default:
        return (
          <div
            className='floating-shape-circle'
            style={{
              ...shapeStyle,
              borderRadius: '50%',
            }}
          />
        );
    }
  };

  if (disabled) return <>{children}</>;

  return (
    <div className={`floating-shapes-container ${className}`}>
      {children}
      <div className='floating-shapes-background'>
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className='floating-shape'
            initial={{
              x: `${shape.x}vw`,
              y: `${shape.y}vh`,
              rotate: 0,
              scale: 0.8,
            }}
            animate={{
              x: [
                `${shape.x}vw`,
                `${Math.max(10, Math.min(90, shape.x + 20))}vw`,
                `${shape.x}vw`,
              ],
              y: [
                `${shape.y}vh`,
                `${Math.max(10, Math.min(90, shape.y + 15))}vh`,
                `${shape.y}vh`,
              ],
              rotate: [0, 360, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {getShapeElement(shape)}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FloatingShapes;
