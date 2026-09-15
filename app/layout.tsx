import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inkwenkwezi Private Game Reserve | Five Worlds. One Wild Escape.",
  description:
    "An independent speculative concept for Inkwenkwezi Private Game Reserve on the Wild Coast near East London. Five biomes, luxury safari tented accommodation, and wildlife encounters.",
  other: {
    "speculative-concept": "LocalAI Systems",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
