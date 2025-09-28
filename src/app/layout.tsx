import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "aaaaaaaaaYouApp – Interest-Based Social Matchmaking Powered by YOUAI™",
  description:
    "YouApp uses YOUAI™ to match you with aligned friends, partners, and hosts through AI and metaphysical wisdom—turning shared interests into real-life experiences that spark connection, growth, and purpose.",
  icons: {
    icon: "/youapp-icon.png",
    shortcut: "/youapp-icon.png",
    apple: "/youapp-icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white h-screen w-screen bg-radial-[at_90%_5%]  from-[#1F4247] via-[#0D1D23] via-60% to-[#09141A] to-100% bg-fixed`}
      >
        {children}
        <Toaster visibleToasts={1} richColors />
      </body>
    </html>
  );
}
