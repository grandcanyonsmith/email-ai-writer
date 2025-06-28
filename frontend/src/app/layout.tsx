import "./globals.css";
import { ReactNode } from "react";
import DashboardLayout from "./dashboard/layout";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Email AI Writer",
  description: "AI-powered email sequence generator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-sans antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
