import React from 'react'
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
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
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${poppins.className}`}>
        <Navbar />
        {children}
        <Footer />  
      </body>
    </html>
  );
}
