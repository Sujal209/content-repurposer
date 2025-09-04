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
  title: "ContentCraft - AI-Powered Content Repurposer",
  description: "Transform your long-form content into engaging social media posts with AI. Perfect for indie makers, solopreneurs, and content creators.",
  keywords: ["content repurposing", "AI content", "social media", "indie makers", "content creation"],
  authors: [{ name: "ContentCraft" }],
  creator: "ContentCraft",
  publisher: "ContentCraft",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://contentcraft.ai",
    title: "ContentCraft - AI-Powered Content Repurposer",
    description: "Transform your long-form content into engaging social media posts with AI.",
    siteName: "ContentCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentCraft - AI-Powered Content Repurposer",
    description: "Transform your long-form content into engaging social media posts with AI.",
    creator: "@contentcraft",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
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
      <body className="antialiased">
        <ToastProvider>
          <ProductionAuthProvider>
            {children}
            <AuthRecoveryHandler />
          </ProductionAuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
