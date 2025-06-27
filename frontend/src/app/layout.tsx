import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/layout";

export const metadata = {
  title: "Email AI Writer",
  description: "AI-powered email sequence generator",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/profile";

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 font-sans antialiased">
        {isDashboard ? (
          <DashboardLayout>{children}</DashboardLayout>
        ) : (
          <main className="flex flex-col min-h-screen items-center justify-center">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
