"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";

function SessionBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthBootstrap();
  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <SessionBootstrap>{children}</SessionBootstrap>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
