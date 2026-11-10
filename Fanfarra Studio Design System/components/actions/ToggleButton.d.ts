import * as React from 'react';

/**
 * On/off pill with icon + label, e.g. "Loop". Same footprint as Select so they sit in one toolbar row.
 */
export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  onPressedChange?: (next: boolean) => void;
  /** Leading Lucide icon name. */
  icon?: string;
  /** md 42px, lg 46px. @default 'md' */
  size?: 'md' | 'lg';
  children?: React.ReactNode;
}

export declare function ToggleButton(props: ToggleButtonProps): JSX.Element;
