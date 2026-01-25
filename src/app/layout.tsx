import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/next";
import { ReactQueryProvider } from "@/lib/react-query";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Fnlly",
  description: "Fnlly es un rastreador de finanzas simple, privado y directo.",
  keywords: ["finanzas", "inversiones", "rastreador", "portafolio", "activos"],
  authors: [{ name: "cocodrilette" }],
  creator: "cocodrilette",
  metadataBase: new URL("https://fnlly.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Fnlly",
    title: "Fnlly",
    description:
      "Simple, privado y directo. Registra tus inversiones y observa su evolucion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fnlly",
    description:
      "Simple, privado y directo. Registra tus inversiones y observa su evolucion.",
    creator: "@cocodrilette",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased layout`}
      >
        <ReactQueryProvider>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Header />
          <ErrorBoundary>{children}</ErrorBoundary>
          <Analytics />
          <SpeedInsights />
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
