import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-loaded",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myweekendatlas.com"),
  title: {
    default: "Weekend Atlas · Pee Dee",
    template: "%s · Weekend Atlas",
  },
  description:
    "What is open this weekend in the Pee Dee, and how far is the drive from Hartsville, Florence, or Cheraw.",
  openGraph: {
    title: "Weekend Atlas",
    description:
      "Map-first weekend tool for the Pee Dee. Seed year 2026.",
    url: "https://myweekendatlas.com",
    siteName: "Weekend Atlas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
