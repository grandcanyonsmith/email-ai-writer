"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/layout";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  // Only wrap /dashboard/* (subpages) and /profile in DashboardLayout
  const isDashboardSubpage = pathname.startsWith("/dashboard/") && pathname !== "/dashboard";
  const isProfile = pathname === "/profile";

  if (isDashboardSubpage || isProfile) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // For /dashboard, render children directly (no sidebar)
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100">
      {children}
    </main>
  );
} 