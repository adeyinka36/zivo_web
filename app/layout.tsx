import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { QuizProvider } from "../context/QuizContext";
import { QueryProvider } from "../components/providers/QueryProvider";
import ResponsiveNavigation from "../components/navigation/ResponsiveNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zivo",
  description: "Zivo - Your social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <QuizProvider>
              <ToastProvider>
                <div className="min-h-screen bg-black">
                <ResponsiveNavigation />
                <div className="flex">
                  <div className="hidden lg:block lg:w-64"></div>
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </div>
              </ToastProvider>
            </QuizProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
