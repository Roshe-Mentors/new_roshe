import React from 'react'
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roshe Mentorship",
  description: "Change the world through mentorship",
  icons: {
    icon: [
      {
        url: '/roshementorship.png',
        sizes: '32x32',
        type: 'image/ico',
      },
      {
        url: '/roshementorship.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    apple: {
      url: "/roshementorship.png",
      sizes: "180x180",
      type: "image/png",
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
        <Navbar />
        <Footer />
      </body>
    </html>
  );
}
