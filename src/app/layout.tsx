import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vocatio — Trips you were meant to take",
  description:
    "Catholic pilgrimage and custom group travel. Get a personalized Vocatio itinerary draft in 90 seconds — then let our planners perfect it.",
  openGraph: {
    title: "Vocatio — Trips you were meant to take",
    description:
      "Personalized itineraries from our planners and an AI first-draft. Pilgrimages, parish groups, family trips.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
