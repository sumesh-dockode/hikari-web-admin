'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000, // 10 second
      retry: (failureCount, error) => {
        const err = error as AxiosError;
        console.log('err', err);
        console.log('error', error);
        if (
          err?.response !== undefined &&
          [403, 404, 503, 504].includes(err?.response?.status)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default Providers;
