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
      <body>{children}</body>
    </html>
  );
}

export const dynamic = "force-dynamic";
