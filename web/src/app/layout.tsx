import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Powlang - Simple and Efficient Compilation Language",
  description: "Powlang is a basic compilation language designed for straightforward programming and efficient code generation.",
  keywords: "Powlang, compilation language, programming, code generation, tech",
  authors: [{
    name: "Sopow",
    url: "https://sopow-fr-sopows-projects.vercel.app/"
  }],
  twitter: {
    card: "summary",
    site: "@powlang",
    title: "Powlang - Simple and Efficient Compilation Language",
    description: "Discover Powlang, a basic yet powerful compilation language designed for efficiency and simplicity. Visit our site for more information.",
    images: [{
      url: ""
    }]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
