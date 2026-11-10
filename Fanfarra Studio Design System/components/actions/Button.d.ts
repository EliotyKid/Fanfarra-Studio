import * as React from 'react';

/**
 * Text button. Primary = filled violet (one per view: the main commit action). Secondary = outlined. Ghost = quiet.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Height: sm 34px, md 42px, lg 46px. @default 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Leading Lucide icon name (see Icon). */
  icon?: string;
  /** Trailing Lucide icon name. */
  iconRight?: string;
  /** Stretch to container width. */
  block?: boolean;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
