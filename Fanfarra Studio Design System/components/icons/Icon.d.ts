import * as React from 'react';

/** Lucide path data keyed by icon name. */
export declare const ICON_PATHS: Record<string, string>;

/**
 * Lucide line icon (24px grid, 2px stroke, round caps). Transport glyphs (play, pause, skip-*, square) render filled.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Icon name, e.g. 'play', 'skip-back', 'volume-2', 'rotate-cw', 'chevron-down', 'music', 'music-2', 'drum', 'info', 'mail', 'expand', 'menu', 'arrow-left', 'check', 'x'. */
  name: string;
  /** Pixel size. @default 20 */
  size?: number;
  /** @default 2 */
  strokeWidth?: number;
  /** Force filled/outline rendering. */
  filled?: boolean;
  /** @default 'currentColor' */
  color?: string;
  /** Accessible label; omit for decorative icons (aria-hidden). */
  title?: string;
}

export declare function Icon(props: IconProps): JSX.Element | null;
