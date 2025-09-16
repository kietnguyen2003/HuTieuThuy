import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Merriweather, Montserrat, Open_Sans } from "next/font/google"
import './globals.css'; // Nếu bạn có file CSS toàn cục

// Cấu hình các font
const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '700'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${merriweather.variable} ${montserrat.variable} ${openSans.variable}`}>
      <head>
        <link rel="icon" href="/icon.jpg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Hủ tiếu Thủy",
  description: "Hủ tiếu Thủy - Nơi mang đến hương vị truyền thống và đậm đà của món hủ tiếu miền Nam.",
  generator: "Next.js",
}
