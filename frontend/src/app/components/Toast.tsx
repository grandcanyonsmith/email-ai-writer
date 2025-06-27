"use client";
import { useEffect } from "react";

export default function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-semibold text-center transition-all animate-fade-in-up ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      {message}
    </div>
  );
}

// Add this to your globals.css:
// @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
// .animate-fade-in-up { animation: fade-in-up 0.4s cubic-bezier(.4,0,.2,1) both; } 