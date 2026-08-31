import type { Metadata } from "next";
import "./globals.css";
import { TrailmarkProvider } from "@/context/TrailmarkContext";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Trailmark — AI Personalized Learning Path",
  description:
    "An AI-powered academic learning path recommender grounded in the Ink & Canvas philosophy. Adaptive assessments, tailored roadmaps, and scholarly community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..900;1,8..60,300..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <TrailmarkProvider>
          <AppShell>{children}</AppShell>
        </TrailmarkProvider>
      </body>
    </html>
  );
}
