import Link from "next/link";
import { Star } from "lucide-react";
import { HotelSearchResult } from "@/types/hotel";
import { Card, CardContent } from "@/components/ui/card";

/**
 * FE-1: hotel card shown in search results — photo, name, starting price,
 * rating. Clickable, navigates to the hotel detail page (FE-3).
 *
 * NOTE (UI redesign): visual styling only — same props (`HotelSearchResult`),
 * same `Link` target, same data fields. Used unchanged on the /hotels
 * results page and reused as-is in the homepage's Featured Hotels section.
 */
export default function HotelCard({ hotel }: { hotel: HotelSearchResult }) {
  return (
    <Link href={`/hotels/${hotel.id}`} className="block group h-full">
      <Card className="overflow-hidden h-full rounded-2xl border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 shadow">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {hotel.rating.toFixed(1)}
          </div>
        </div>
        <CardContent className="pt-4 pb-5">
          <h3 className="font-serif font-semibold text-lg leading-tight text-gray-900">
            {hotel.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {hotel.city}, {hotel.country}
          </p>
          <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Starting from</span>
            <span className="text-right">
              <span className="font-bold text-blue-700 text-lg">
                ${hotel.startingPrice}
              </span>
              <span className="text-xs text-gray-400"> /night</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
