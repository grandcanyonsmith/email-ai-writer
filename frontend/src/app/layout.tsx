import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Email AI Writer",
  description: "AI-powered email sequence generator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-sans antialiased">
        <main className="flex flex-col min-h-screen items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
