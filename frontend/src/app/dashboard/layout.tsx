import Link from "next/link";
import { ReactNode } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/sequences", label: "Sequences" },
  { href: "/profile", label: "Profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-100">
      <aside className="w-64 bg-white border-r border-gray-100 shadow-lg flex flex-col py-8 px-6">
        <div className="mb-10">
          <span className="text-2xl font-bold text-blue-700">Email AI Writer</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action="/logout" method="post" className="mt-10">
          <button type="submit" className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">Logout</button>
        </form>
      </aside>
      <main className="flex-1 flex flex-col items-center justify-start p-10">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
} 