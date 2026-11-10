import * as React from 'react';

/**
 * Speaker glyph + slider. Glyph reflects level (volume-x / volume-1 / volume-2); clicking it toggles mute when onMuteToggle is given.
 */
export interface VolumeSliderProps {
  /** 0–100. @default 70 */
  value?: number;
  onChange?: (value: number) => void;
  muted?: boolean;
  onMuteToggle?: (muted: boolean) => void;
  /** @default true */
  showIcon?: boolean;
  /** @default 'Volume' */
  label?: string;
  /** Fixed width (px or CSS length); otherwise flexes. */
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

export declare function VolumeSlider(props: VolumeSliderProps): JSX.Element;
