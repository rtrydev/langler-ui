import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Noto_Sans_JP,
  Noto_Sans_Myanmar,
  Noto_Serif,
  Noto_Serif_JP,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  preload: false,
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  preload: false,
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-sans-myanmar",
  subsets: ["myanmar"],
  weight: ["400", "500", "700"],
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Langler",
  description: "Your languages. Your AI. One notebook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSerif.variable} ${notoSansJp.variable} ${notoSerifJp.variable} ${notoSansMyanmar.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
