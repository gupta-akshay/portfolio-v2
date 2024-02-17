import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "@/app/styles/globals.scss";

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "Akshay Gupta",
  description: "Akshay Gupta | Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
