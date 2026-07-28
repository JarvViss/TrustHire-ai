import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import Providers from "@/providers";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export const metadata: Metadata = {
  title: "TrustHire AI",
  description:
    "AI-powered hiring platform with resume analysis, mock interviews, and credential verification",
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('trusthire-theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster
              richColors
              position="top-right"
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
