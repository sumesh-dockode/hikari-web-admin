'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import ErrorBoundary from './error-boundary';

export default function ErrorBoundaryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const key = pathname !== prevPath.current ? pathname : 'static';

  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  return <ErrorBoundary key={key}>{children}</ErrorBoundary>;
}
