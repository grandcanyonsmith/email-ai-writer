import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  width?: string; // Tailwind max-width class
  className?: string;
}

export default function PageContainer({ children, width = "max-w-3xl", className = "", }: PageContainerProps) {
  return (
    <div className={`w-full ${width} mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
