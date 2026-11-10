import * as React from 'react';

/**
 * Icon-only button: transport prev/next, mute, fullscreen, menu, back.
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name (see Icon). */
  icon: string;
  /** Accessible name — required, also used as tooltip. */
  label: string;
  /** ghost = bare glyph; surface = filled dark circle (transport); outline = 1px ring. @default 'ghost' */
  variant?: 'ghost' | 'surface' | 'outline';
  /** sm 32px, md 40px, lg 52px. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default 'circle' */
  shape?: 'circle' | 'square';
  /** When defined, renders as a toggle (aria-pressed) — pressed state turns violet. */
  pressed?: boolean;
  /** Override glyph size in px. */
  iconSize?: number;
}

export declare function IconButton(props: IconButtonProps): JSX.Element;
