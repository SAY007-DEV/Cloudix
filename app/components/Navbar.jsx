"use client";

import Link from "next/link";
import { Cloud } from "lucide-react";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <nav
        className="
          flex items-center justify-between
          px-8 py-4
          rounded-2xl
          backdrop-blur-xl
          bg-white/10
          border border-white/20
          shadow-lg shadow-black/20
        "
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-wide">
            Weather Bits
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 text-white/80 font-medium">
          <Link
            href="/"
            className="hover:text-white transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/docs"
            className="hover:text-white transition-colors duration-300"
          >
            Docs
          </Link>
        </div>
      </nav>
    </div>
  );
}
