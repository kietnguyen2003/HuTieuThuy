import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Merriweather, Montserrat, Open_Sans } from "next/font/google"

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

export const metadata: Metadata = {
  title: "Bún - Hủ tiếu Mẹ Sin",
  description: "Bún - Hủ tiếu Mẹ Sin - Nơi mang đến hương vị truyền thống và đậm đà của món hủ tiếu miền Nam.",
  generator: "Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${merriweather.variable} ${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Prevent external scripts from adding unwanted classes
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                      const target = mutation.target;
                      if (target.tagName === 'HTML' && target.classList.contains('mdl-js')) {
                        target.classList.remove('mdl-js');
                      }
                    }
                  });
                });

                document.addEventListener('DOMContentLoaded', function() {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['class']
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
