import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export function Container({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return <div className={cx('container', wide && 'container--wide', className)}>{children}</div>;
}
