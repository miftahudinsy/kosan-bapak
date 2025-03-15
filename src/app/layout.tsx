import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kosan Bapak",
  description: "Aplikasi pengelolaan kos-kosan yang mudah dan efisien",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon-192.png"
          type="image/png"
          sizes="192x192"
        />
        <link
          rel="icon"
          href="/icon-512.png"
          type="image/png"
          sizes="512x512"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const dynamic = "force-dynamic";
