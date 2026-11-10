import * as React from 'react';

/**
 * Sidebar / drawer navigation row. Active = violet-soft fill + 4px violet edge bar.
 */
export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Lucide icon (Toques = 'music', Sobre = 'info', Contato = 'mail'). */
  icon?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** Sets aria-current="page". */
  active?: boolean;
  /** Renders an <a> when given, otherwise a <button>. */
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  /** Fully rounded variant for drawers / non-edge placement. */
  inset?: boolean;
}

export declare function NavItem(props: NavItemProps): JSX.Element;
