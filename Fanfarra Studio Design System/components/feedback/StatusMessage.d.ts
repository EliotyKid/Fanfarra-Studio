import * as React from 'react';

/**
 * Feedback row: tone badge + title + colored message + trailing glyph (Sucesso / Aviso / Erro).
 */
export interface StatusMessageProps {
  /** @default 'success' */
  tone?: 'success' | 'warning' | 'danger';
  /** Short label: "Sucesso", "Aviso", "Erro". */
  title?: React.ReactNode;
  /** One sentence, ends with period or "!". */
  message?: React.ReactNode;
  /** inline = bare row (lists, panels); banner = tinted bordered box. @default 'inline' */
  variant?: 'inline' | 'banner';
  /** Replaces the trailing glyph with a close button. */
  onDismiss?: () => void;
  /** Defaults to 'alert' for danger, 'status' otherwise. */
  role?: string;
  className?: string;
}

export declare function StatusMessage(props: StatusMessageProps): JSX.Element;
