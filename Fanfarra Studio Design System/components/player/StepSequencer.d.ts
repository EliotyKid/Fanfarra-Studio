import * as React from 'react';

export interface SequencerTrack {
  id: string;
  /** Instrument name shown in the header. */
  name: string;
  /** Instrument color (--inst-* token). */
  color: string;
  /** One boolean per step; length = bars × stepsPerBar. */
  steps: boolean[];
  muted?: boolean;
}

/**
 * The beat grid: track headers + bar ruler + colored step blocks + violet playhead. Click a cell to toggle a hit.
 * @startingPoint section="Player" subtitle="Fanfarra beat grid with 5 instruments and playhead" viewport="1000x420"
 */
export interface StepSequencerProps {
  tracks: SequencerTrack[];
  /** Number of compassos. @default 4 */
  bars?: number;
  /** Steps per compasso (beats × subdivision). @default 8 */
  stepsPerBar?: number;
  /** Steps per beat — controls beat gridlines. @default 2 */
  stepsPerBeat?: number;
  /** Fractional step position of the playhead; null hides it. */
  playhead?: number | null;
  /** When true, blocks under the playhead flash. */
  playing?: boolean;
  onToggleStep?: (trackId: string, stepIndex: number, on: boolean) => void;
  onMuteToggle?: (trackId: string, muted: boolean) => void;
  /** Mobile density (44px rows, 140px headers). */
  compact?: boolean;
  /** Minimum px per step before the grid scrolls horizontally. @default 20 (18 compact) */
  minCellWidth?: number;
  /** Auto-scroll to keep the playing compasso visible. @default true */
  followPlayhead?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare function StepSequencer(props: StepSequencerProps): JSX.Element;
