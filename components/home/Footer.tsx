import Link from "next/link";
import { Hotel, Facebook, Instagram, Twitter } from "lucide-react";

/**
 * Footer — static links section. "Hotels" is the only real route
 * (existing /hotels search); other links are placeholders since those
 * pages don't exist in the current MVP scope.
 */
export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-700">
              <Hotel className="h-5 w-5 text-gold-300" />
            </span>
            <span className="font-serif text-xl font-bold text-white">
              Luxe Stays
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Curated hotels and resorts for travellers who expect more.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <span
                key={i}
                className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/hotels" className="hover:text-white transition-colors">
                Search Hotels
              </Link>
            </li>
            <li>
              <a href="#destinations" className="hover:text-white transition-colors">
                Destinations
              </a>
            </li>
            <li>
              <a href="#why-us" className="hover:text-white transition-colors">
                Why Choose Us
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
            <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
            <li className="hover:text-white transition-colors cursor-pointer">Press</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">
            Support
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
            <li className="hover:text-white transition-colors cursor-pointer">Cancellation Options</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Luxe Stays. All rights reserved. (MVP demo)
      </div>
    </footer>
  );
}
