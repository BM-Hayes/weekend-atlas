import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-loaded",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-loaded",
});

const ui = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-ui-loaded",
});

const title = "Weekend Atlas | Pee Dee Drive-Time Weekend Guide";
const description =
  "Explore curated fall haunts, pumpkin patches, state parks, and antique markets within 20, 35, and 50 minutes of Hartsville, Florence, and Cheraw. Zero ads, zero fluff.";

export const metadata: Metadata = {
  metadataBase: new URL("https://myweekendatlas.com"),
  title: {
    default: title,
    template: "%s · Weekend Atlas",
  },
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myweekendatlas.com",
    siteName: "Weekend Atlas",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${ui.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
