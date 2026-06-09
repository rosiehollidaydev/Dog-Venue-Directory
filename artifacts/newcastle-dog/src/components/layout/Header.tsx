"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/pubs", label: "Pubs" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/cafes", label: "Cafés" },
  { href: "/hotels", label: "Hotels" },
  { href: "/venues", label: "All Venues" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🐾</span>
            <div className="leading-none">
              <span className="font-bold text-charcoal text-lg tracking-tight">
                Newcastle
              </span>
              <span className="font-bold text-lavender text-lg">.dog</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-charcoal/70 hover:text-charcoal hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/venues"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-lavender/10 text-lavender font-medium text-sm hover:bg-lavender/20 transition-colors"
            >
              <Search size={15} />
              Search
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-charcoal hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-0 pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/venues"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg bg-lavender text-white font-medium text-sm text-center"
              >
                Search Venues
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
