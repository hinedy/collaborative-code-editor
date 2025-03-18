import React from "react";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/providers/AuthProvider";
import { RoomProvider } from "@/providers/room-prrovider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collaborative Code Editor",
  description: "Real-time collaborative code editor with Monaco Editor",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <RoomProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>{" "}
          </RoomProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
