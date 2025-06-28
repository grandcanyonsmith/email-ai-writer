"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/layout";
import Navbar from "./components/Navbar";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-100">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">{children}</main>
    </div>
  );
}
