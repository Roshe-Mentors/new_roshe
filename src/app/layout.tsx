import React from 'react'
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserProvider } from "../lib/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Roshe Mentorship",
  description: "Change the world through mentorship",
  icons: {
    icon: [
      '/images/roshementorship.ico',
      {
        url: '/images/roshementorship.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/roshementorship.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
    shortcut: '/images/roshementorship.ico',
    apple: {
      url: "/images/roshementorship.png",
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
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="/images/rosheBackground.jpg" as="image" />
      </Head>
      <body className={`${poppins.className}`}>
        <UserProvider>
          <Navbar />
          <ToastContainer position="top-right" />
          {children}
          <Footer />
        </UserProvider>  
      </body>
    </html>
  );
}
