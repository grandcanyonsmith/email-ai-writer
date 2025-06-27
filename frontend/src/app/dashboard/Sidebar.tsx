"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/sequences", label: "Sequences", icon: "📧" },
  { href: "/dashboard/templates", label: "Templates", icon: "📝" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Mobile navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 shadow">
        <span className="text-xl font-bold text-blue-700">Email AI Writer</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-blue-50 focus:outline-none">
          <span className="sr-only">Open sidebar</span>
          <svg className="h-6 w-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {/* Sidebar */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col py-8 px-6 transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}> 
        <div className="mb-10 hidden md:block">
          <span className="text-2xl font-bold text-blue-700">Email AI Writer</span>
        </div>
        <nav className="flex-1 space-y-2 mt-10 md:mt-0">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${pathname === link.href ? "bg-blue-50 text-blue-700" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
        <form action="/logout" method="post" className="mt-10">
          <button type="submit" className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">Logout</button>
        </form>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-10 mt-16 md:mt-0">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
} 