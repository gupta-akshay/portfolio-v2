import React from 'react';
import styles from './Icon.module.scss';
import { icons, type IconName } from './icons';

interface IconProps {
  name: IconName;
  className?: string;
  title?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  spin?: boolean;
  size?: '2x' | '3x';
  height?: number;
  width?: number;
  fontSize?: number;
}

const Icon = ({
  name,
  className,
  title,
  'aria-hidden': ariaHidden,
  spin,
  size,
  height,
  width,
  fontSize,
}: IconProps) => {
  const icon = icons[name];

  const svgHeight: number | string = height ?? (size ? `${parseFloat(size)}em` : '1em');
  const svgWidth: number | string = width ?? 'auto';

  const classNames = [styles.icon, spin ? styles.spin : undefined, className]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties | undefined =
    fontSize !== undefined ? { fontSize } : undefined;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={icon.viewBox}
      height={svgHeight}
      width={svgWidth}
      fill='currentColor'
      aria-hidden={ariaHidden}
      className={classNames}
      style={style}
    >
      {title && <title>{title}</title>}
      <path d={icon.path} />
    </svg>
  );
};

export default Icon;
export type { IconName };
