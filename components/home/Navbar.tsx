"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sticky navbar. Transparent over the hero, switches to solid white
 * with a shadow once the user scrolls past the hero banner — the
 * standard Booking.com / MakeMyTrip pattern.
 *
 * Purely presentational — "Sign In" has no auth wired up yet (auth is
 * out of scope per the project's MVP phase), so it's a visual-only
 * button for now.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Hotels", href: "/hotels" },
    { label: "Destinations", href: "#destinations" },
    { label: "Why Us", href: "#why-us" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center h-9 w-9 rounded-lg ${
              scrolled ? "bg-blue-700" : "bg-white/15 backdrop-blur"
            }`}
          >
            <Hotel className={`h-5 w-5 ${scrolled ? "text-gold-300" : "text-white"}`} />
          </span>
          <span
            className={`font-serif text-xl font-bold tracking-tight ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Luxe Stays
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-blue-700"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant={scrolled ? "outline" : "secondary"}
            size="sm"
            className={
              scrolled
                ? "border-gray-300"
                : "bg-white/10 text-white border border-white/30 hover:bg-white/20"
            }
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-gold-500 hover:bg-gold-600 text-blue-950 font-semibold"
          >
            List Your Hotel
          </Button>
        </div>

        <button
          className={`md:hidden ${scrolled ? "text-gray-900" : "text-white"}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-4 mx-4 bg-white rounded-xl shadow-xl p-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-blue-700 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full bg-blue-700 hover:bg-blue-800 mt-2">
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
