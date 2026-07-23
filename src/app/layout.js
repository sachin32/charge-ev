import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Charge EV",
  description: "Charge your electric vehical near by charging station",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3925104231076381"
          crossorigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
