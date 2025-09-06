import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
// Enhanced wallet provider with Web3 integration
import { EnhancedWalletProvider } from '../lib/enhanced-wallet-context';
// Enhanced auth provider with email authentication
import { EnhancedAuthProvider } from '../lib/enhanced-auth-context';
// Supra wallet provider for blockchain integration
import { SupraWalletProvider } from '../lib/wallet-context-supra';
// Add Telegram Mini App provider
import { TelegramProvider } from './components/TelegramMiniApp';
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
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        <ErrorBoundary>
          <EnhancedAuthProvider>
            <SupraWalletProvider>
              <EnhancedWalletProvider>
                <TelegramProvider>
                  {children}
                </TelegramProvider>
              </EnhancedWalletProvider>
            </SupraWalletProvider>
          </EnhancedAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
