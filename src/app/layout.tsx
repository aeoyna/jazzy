import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JAM",
  description: "Minimalist Jazz Jam Session Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[var(--app-bg)] min-h-screen`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
