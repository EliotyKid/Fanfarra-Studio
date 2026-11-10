import * as React from 'react';

/**
 * Instrument row label: color dot + name + mute toggle. Sits at the left of each sequencer lane.
 */
export interface TrackHeaderProps {
  /** Instrument name: Bumbo, Prato, Tarol, Surdo, Repique. */
  name: string;
  /** Instrument color — use the --inst-* tokens. */
  color: string;
  muted?: boolean;
  /** Pass null to hide the mute button. */
  onMuteToggle?: ((muted: boolean) => void) | null;
  /** Mobile density: 44px row, transparent background, 13px text. */
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare function TrackHeader(props: TrackHeaderProps): JSX.Element;
