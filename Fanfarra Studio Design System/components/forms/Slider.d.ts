import * as React from 'react';

/**
 * Horizontal slider: 6px ink track, violet fill, 16px violet thumb with halo. Pointer + keyboard (arrows ±5 steps, PgUp/PgDn ±10%).
 */
export interface SliderProps {
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  onChange?: (value: number) => void;
  /** Accessible name. @default 'Valor' */
  label?: string;
  /** Screen-reader text for the value, e.g. "72%". */
  valueText?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export declare function Slider(props: SliderProps): JSX.Element;
