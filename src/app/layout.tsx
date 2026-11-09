import type { Metadata, Viewport } from "next";
import { Archivo, Be_Vietnam_Pro } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { ConsultProvider } from "@/components/consult/ConsultProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { site } from "@/content/site";
import { shareImage } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-bvp",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // Set SITE_URL to the public domain at deploy time; share images resolve against it.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3100"),
  title: { default: site.homeTitle, template: site.titleTemplate },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: site.homeTitle,
    description: site.description,
    images: [shareImage],
  },
  twitter: { card: "summary_large_image", images: [shareImage] },
};

export const viewport: Viewport = {
  themeColor: "#F5F5F8",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${archivo.variable} ${beVietnam.variable}`}>
      <body className="relative flex min-h-[100dvh] flex-col">
        <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-2 w-px" />
        <ToastProvider>
          <ConsultProvider>
            <Header />
            {children}
          </ConsultProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
