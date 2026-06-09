import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Appeal Your Medicare Advantage Denial — Free Letter Generator",
    template: "%s | MA Appeal Helper",
  },
  description:
    "Medicare Advantage denied your care? Most appeals win. Upload your denial letter and get a ready-to-send appeal letter in minutes — free.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "MA Appeal" },
};

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <footer className="mx-auto mt-16 max-w-3xl border-t border-slate-200 px-6 py-8 text-base text-slate-500">
          <p>
            This is a self-advocacy tool, not legal advice and not a law firm.
            It helps you exercise your existing Medicare appeal rights. Not
            affiliated with Medicare, CMS, or any insurer.
          </p>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); }`,
          }}
        />
      </body>
    </html>
  );
}
