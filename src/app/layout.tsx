import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JPAN Unit Perolehan System",
  description: "Document Tracking & Management System for Unit Perolehan, JPAN",
};

import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-hidden transition-colors duration-500">
        <ThemeProvider>
          {/* Ambient Mesh Background */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <div className="mesh-blob bg-blue-500 w-96 h-96 top-0 left-[-10%]"></div>
            <div className="mesh-blob bg-indigo-500 w-[30rem] h-[30rem] top-[20%] right-[-10%] animation-delay-2000"></div>
            <div className="mesh-blob bg-blue-400 w-80 h-80 bottom-[-10%] left-[20%] animation-delay-4000"></div>
          </div>
          
          {/* Main Content Area */}
          <main className="flex-grow flex flex-col w-full h-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
