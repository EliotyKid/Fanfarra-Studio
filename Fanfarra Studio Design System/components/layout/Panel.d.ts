import * as React from 'react';

/**
 * Elevated container: ink-900 fill, 1px subtle border, 16px radius, soft drop shadow. Used for the player frame and info panels.
 */
export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional heading (20px / 700). */
  title?: React.ReactNode;
  /** Remove padding + clip children (for full-bleed content such as the sequencer). */
  flush?: boolean;
  /** Element tag. @default 'section' */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export declare function Panel(props: PanelProps): JSX.Element;
