import "./globals.css";

import type { Metadata } from "next";
import  QueryProvider  from "@/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TrustHire AI",
  description: "AI + Blockchain Resume Verification Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}