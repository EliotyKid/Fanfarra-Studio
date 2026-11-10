import * as React from 'react';

/**
 * Prev · Play/Pause · Next cluster (+ optional Loop on mobile).
 * @startingPoint section="Player" subtitle="Transport cluster: previous, play/pause, next" viewport="700x180"
 */
export interface TransportControlsProps {
  playing?: boolean;
  onPlayToggle?: (nextPlaying: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  /** Loop state — only rendered when onLoopToggle is given (mobile layout). */
  loop?: boolean;
  onLoopToggle?: (next: boolean) => void;
  /** lg = desktop (surface circles, 58px play); sm = mobile (bare glyphs, 48px play). @default 'lg' */
  size?: 'sm' | 'lg';
  /** Distribute across full width (mobile). */
  spread?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare function TransportControls(props: TransportControlsProps): JSX.Element;
