import type { Metadata } from "next";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { AxiomWebVitals } from "next-axiom";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { BootstrapConfig } from "posthog-js";
import "../styles/globals.css";
import { PostHogPageview, PostHogProvider } from "@/providers/PostHogProvider";
import { env } from "@/env";
import { GlobalProviders } from "@/providers/GlobalProviders";
import { UTM } from "@/app/utm";
import { startupImage } from "@/app/startup-image";
import { getPosthogBootstrapData } from "@/utils/posthog/bootstrap";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});
const calFont = localFont({
  src: "../styles/CalSans-SemiBold.woff2",
  variable: "--font-cal",
  preload: true,
  display: "swap",
});

const title = "Inbox Zero | Automate and clean your inbox";
const description =
  "Inbox Zero is your AI personal assistant for email and the quickest way to reach inbox zero. Automate your email, bulk unsubscribe from newsletters, block cold emails, and view your email analytics. Open-source.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Inbox Zero",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@inboxzero_ai",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  // issues with robots.txt: https://github.com/vercel/next.js/issues/58615#issuecomment-1852457285
  robots: {
    index: true,
    follow: true,
  },
  // pwa
  applicationName: "Inbox Zero",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inbox Zero",
    startupImage,
  },
  formatDetection: {
    telephone: false,
  },
  // safe area for iOS PWA
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "white-translucent",
  },
};

export const viewport = {
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let bootstrapData: BootstrapConfig | null = null;
  try {
    bootstrapData = await getPosthogBootstrapData();
  } catch (error) {
    console.error("Error fetching PostHog bootstrap data:", error);
  }

  return (
    <html lang="en" className="h-full">
      <body
        className={`h-full ${inter.variable} ${calFont.variable} font-sans antialiased`}
      >
        <PostHogProvider bootstrapData={bootstrapData}>
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <GlobalProviders>{children}</GlobalProviders>
        </PostHogProvider>
        <SpeedInsights />
        <Analytics />
        <AxiomWebVitals />
        <UTM />
        {env.NEXT_PUBLIC_GTM_ID ? (
          <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        ) : null}
      </body>
    </html>
  );
}
