import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductionAuthProvider } from "@/lib/auth-context-production";
import { ToastProvider } from "@/components/ui/toast";
import { AuthRecoveryHandler } from "@/components/auth-recovery";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "ContentCraft - AI-Powered Content Repurposer",
  description: "Transform your long-form content into engaging social media posts with AI. Perfect for indie makers, solopreneurs, and content creators.",
  keywords: ["content repurposing", "AI content", "social media", "indie makers", "content creation"],
  authors: [{ name: "ContentCraft" }],
  creator: "ContentCraft",
  publisher: "ContentCraft",
  icons: {
    icon: "/repurposemate-logo.png",
    shortcut: "/repurposemate-logo.png",
    apple: "/repurposemate-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://contentcraft.ai",
    title: "ContentCraft - AI-Powered Content Repurposer",
    description: "Transform your long-form content into engaging social media posts with AI.",
    siteName: "ContentCraft",
    images: [
      {
        url: "/repurposemate-logo.png",
        width: 1200,
        height: 630,
        alt: "ContentCraft - AI-Powered Content Repurposer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentCraft - AI-Powered Content Repurposer",
    description: "Transform your long-form content into engaging social media posts with AI.",
    creator: "@contentcraft",
    images: ["/repurposemate-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Suppress preload warnings in development */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Comprehensive preload warning suppression
                const originalWarn = console.warn;
                const originalError = console.error;
                
                console.warn = function(...args) {
                  const message = args[0] && args[0].toString ? args[0].toString() : '';
                  if (
                    message.includes('was preloaded using link preload but not used') ||
                    message.includes('preloaded but not used within a few seconds') ||
                    message.includes('resource was preloaded using')
                  ) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                console.error = function(...args) {
                  const message = args[0] && args[0].toString ? args[0].toString() : '';
                  if (
                    message.includes('was preloaded using link preload but not used') ||
                    message.includes('preloaded but not used within a few seconds')
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased cyber-scanlines" suppressHydrationWarning>
        <ToastProvider>
          <ProductionAuthProvider>
            {/* Enhanced cyberpunk background layers */}
            <div aria-hidden="true" className="cyber-grid" />
            <div aria-hidden="true" className="data-lines" />
            <div aria-hidden="true" className="cyber-haze" />
            
            {/* Additional cyberpunk elements */}
            <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1]">
              {/* Matrix rain effect */}
              <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse" style={{animationDelay: '0s', animationDuration: '4s'}} />
              <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent animate-pulse" style={{animationDelay: '1s', animationDuration: '6s'}} />
              <div className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-transparent via-purple-400/25 to-transparent animate-pulse" style={{animationDelay: '2s', animationDuration: '5s'}} />
              <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-green-400/20 to-transparent animate-pulse" style={{animationDelay: '3s', animationDuration: '7s'}} />
              
              {/* Floating orbs */}
              <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-cyan-400/40 animate-pulse" style={{animationDelay: '0s', animationDuration: '3s'}} />
              <div className="absolute top-[60%] right-[20%] w-1 h-1 rounded-full bg-pink-400/50 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '4s'}} />
              <div className="absolute top-[40%] left-[70%] w-1.5 h-1.5 rounded-full bg-purple-400/30 animate-pulse" style={{animationDelay: '2.5s', animationDuration: '5s'}} />
              <div className="absolute top-[80%] left-[40%] w-1 h-1 rounded-full bg-green-400/40 animate-pulse" style={{animationDelay: '4s', animationDuration: '3.5s'}} />
              
              {/* Circuit-like lines */}
              <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
              <div className="absolute top-[70%] left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/15 to-transparent" />
            </div>
            
            {children}
            <AuthRecoveryHandler />
          </ProductionAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
