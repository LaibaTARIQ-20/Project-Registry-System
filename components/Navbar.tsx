"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, Upload } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/upload",
      label: "Upload",
      icon: <Upload size={18} />,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: <Database size={18} />,
    },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">

        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 tracking-tight"
        >
          FYP Vault
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}