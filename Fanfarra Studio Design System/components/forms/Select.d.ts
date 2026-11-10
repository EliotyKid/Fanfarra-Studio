import * as React from 'react';

export interface SelectOption { value: string | number; label: string; }

/**
 * Pill dropdown for musical parameters (BPM, time signature). Value renders in JetBrains Mono.
 */
export interface SelectProps {
  value: string | number;
  /** Plain values or {value,label} objects. */
  options: Array<string | number | SelectOption>;
  onChange?: (value: string | number) => void;
  /** Leading Lucide icon (e.g. 'music-2' for BPM, 'drum' for compasso). */
  icon?: string;
  /** Accessible name, e.g. "Andamento". */
  label?: string;
  /** md 42px, lg 46px. @default 'md' */
  size?: 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  /** Custom trigger text, e.g. o => `${o.value} BPM`. */
  renderValue?: (option: SelectOption | undefined) => React.ReactNode;
  className?: string;
  id?: string;
}

export declare function Select(props: SelectProps): JSX.Element;
