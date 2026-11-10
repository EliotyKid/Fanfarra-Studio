import * as React from 'react';

/**
 * The hero action: violet circle with play/pause glyph and soft violet glow.
 */
export interface PlayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  playing?: boolean;
  onToggle?: (nextPlaying: boolean) => void;
  /** lg 58px (desktop), sm 48px (mobile / inline). @default 'lg' */
  size?: 'sm' | 'lg';
}

export declare function PlayButton(props: PlayButtonProps): JSX.Element;
