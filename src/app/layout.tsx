import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import { GlobalNavigationLoader } from "@/components/global-navigation-loader";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://mytravelcore.com";
const OG_IMAGE =
  "https://storage.googleapis.com/msgsndr/PfHZoaIxRooTMHzcnant/media/6981005c66e7ca255c0851f0.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "TravelCore | Experiencias de viaje inteligentes y personalizadas",
    template: "%s | TravelCore",
  },

  description:
    "Agencia de viajes con más de 18 años de experiencia. Diseñamos viajes corporativos y vacacionales a la medida, con acompañamiento antes, durante y después del viaje y soporte 24/7.",

  keywords: [
    "agencia de viajes",
    "viajes corporativos",
    "viajes vacacionales",
    "agencia de viajes costa rica",
    "viajes a la medida",
    "eventos corporativos",
    "boletos aéreos",
    "turismo corporativo",
    "TravelCore",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TravelCore",
    title: "TravelCore | Experiencias de viaje inteligentes",
    description:
      "Viajes corporativos y vacacionales a la medida, con atención personalizada y soporte 24/7.",
    locale: "es_CR",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "TravelCore",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TravelCore | Viajes inteligentes a la medida",
    description:
      "Diseñamos experiencias de viaje corporativas y vacacionales con atención humana y soporte 24/7.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CR" suppressHydrationWarning className="overflow-y-auto">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KJHPFX69');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>

      <body className={`${inter.className} min-h-screen overflow-y-auto`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJHPFX69"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <GlobalNavigationLoader />
          </Suspense>
          {children}
          <Toaster />
        </ThemeProvider>

        <TempoInit />
      </body>
    </html>
  );
}
