import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
// Client-only providers wrapper
import { ClientOnlyProviders } from './components/ClientOnlyProviders';
// Error boundary for client-side error handling
import ErrorBoundary from './components/ErrorBoundary';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropify Technologies | Web3 Onboarding Platform",
  description: "Revolutionary Web2→Web3 onboarding platform with patent-pending seamless wallet generation technology. Built on Supra L1 blockchain.",
  keywords: "Dropify Technologies, Web3 Onboarding, Supra L1, Blockchain, Patent Technology, Seamless Wallet, DROP Tokens, DRF Tokens, Automated Distribution",
  authors: [{ name: "Dropify Technologies" }],
  openGraph: {
    title: "Dropify Technologies - Web3 Onboarding Revolution",
    description: "Patent-pending technology for seamless Web2→Web3 transition with automated token distribution on Supra L1",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' https: data: blob:; style-src 'self' 'unsafe-inline' https: data:; img-src 'self' data: https: blob:; connect-src 'self' https: wss: data: blob:; frame-src 'self' https: data:; font-src 'self' https: data:; worker-src 'self' blob: data:;" />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        <ErrorBoundary>
          <ClientOnlyProviders>
            {children}
          </ClientOnlyProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
