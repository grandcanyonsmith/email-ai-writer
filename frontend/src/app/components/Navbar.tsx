"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white/70 backdrop-blur border-b border-gray-100 py-4 px-6 shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800">
        Email AI Writer
      </Link>
    </header>
  );
}
