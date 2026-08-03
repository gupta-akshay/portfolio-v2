import React from 'react';
import styles from './Icon.module.scss';
import { icons, type IconName } from './icons';
import { techIcons, type TechIconName } from './techIcons';

/** UI glyphs and technology logos share one lookup and one component. */
type AnyIconName = IconName | TechIconName;

interface IconProps {
  name: AnyIconName;
  // CSS-module lookups are typed `string | undefined`, and the project runs
  // with exactOptionalPropertyTypes, so undefined has to be allowed explicitly.
  className?: string | undefined;
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
  const icon =
    name in icons
      ? icons[name as IconName]
      : techIcons[name as TechIconName];

  const svgHeight: number | string =
    height ?? (size ? `${parseFloat(size)}em` : '1em');
  // Omit width when not explicitly set — the browser derives it from the
  // viewBox aspect ratio. Passing width="auto" as an SVG attribute is treated
  // as 100% by many browsers (SVG 1.1 default), which breaks inline layout.
  const svgWidth: number | undefined = width;

  const classNames = [styles.icon, spin ? styles.spin : undefined, className]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties | undefined =
    fontSize !== undefined ? { fontSize } : undefined;

  // Default decorative icons to aria-hidden. Only expose to assistive tech
  // when a title is provided (making the icon meaningful) or the caller
  // explicitly opts in via aria-hidden={false}.
  const resolvedAriaHidden = ariaHidden ?? (title ? undefined : true);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox={icon.viewBox}
      height={svgHeight}
      width={svgWidth}
      fill='currentColor'
      aria-hidden={resolvedAriaHidden}
      className={classNames}
      style={style}
    >
      {title && <title>{title}</title>}
      {icon.paths
        ? icon.paths.map((shape, i) => (
            <path key={i} d={shape.d} fill={shape.fill} />
          ))
        : icon.path && <path d={icon.path} />}
    </svg>
  );
};

export default Icon;
export type { IconName, TechIconName, AnyIconName };
