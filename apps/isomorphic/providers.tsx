"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000, // 10 second
    },
  },
});

function Providers({
  children,
  // session,
}: Readonly<{
  children: React.ReactNode;
  // session: Session | null;
}>) {
  return (
    // <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      // <Toaster />
    // </SessionProvider>
  );
}

export default Providers;
