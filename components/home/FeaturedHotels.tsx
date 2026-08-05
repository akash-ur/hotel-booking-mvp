"use client";

import { useQuery } from "@tanstack/react-query";
import { HotelSearchResult } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";

/**
 * Homepage "Featured Hotels" section.
 *
 * Deliberately reuses what already exists rather than introducing
 * anything new on the data layer:
 * - Same `/api/hotels` route used by app/hotels/page.tsx (BE-2, unchanged)
 * - Same React Query `useQuery` pattern already used elsewhere
 * - Same `HotelCard` component used on the search results page
 *
 * Only fetches the first few results to keep the homepage focused.
 */
async function fetchFeaturedHotels(): Promise<HotelSearchResult[]> {
  const res = await fetch("/api/hotels");
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to load hotels");
  }
  return json.data;
}

export default function FeaturedHotels() {
  const { data: hotels, isLoading, isError } = useQuery({
    queryKey: ["hotels", "featured"],
    queryFn: fetchFeaturedHotels,
  });

  // Homepage section is decorative — fail quietly rather than breaking the page.
  if (isError) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-blue-700 text-xs font-semibold tracking-[0.25em] uppercase">
          Handpicked For You
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
          Featured Hotels
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          A curated selection of our most-loved stays, from beachfront resorts
          to mountain lodges.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {hotels && hotels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </section>
  );
}
