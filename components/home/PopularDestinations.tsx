import Link from "next/link";
import { hotels } from "@/data/hotels";

/**
 * "Popular Destinations" section. Cities are derived directly from the
 * existing `data/hotels.ts` mock data (no new data source), and each
 * card links into the existing search flow (`/hotels?destination=`),
 * exactly like submitting the search form would.
 */
export default function PopularDestinations() {
  const destinations = hotels.map((hotel) => ({
    city: hotel.city,
    country: hotel.country,
    image: hotel.images[0],
  }));

  return (
    <section id="destinations" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-blue-700 text-xs font-semibold tracking-[0.25em] uppercase">
            Explore
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
            Popular Destinations
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            From city skylines to mountain peaks — find hotels wherever
            you&apos;re headed next.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={`/hotels?destination=${encodeURIComponent(dest.city)}`}
              className="group relative rounded-2xl overflow-hidden h-72 shadow-lg hover:shadow-2xl transition-shadow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.image}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif text-white text-xl font-semibold">
                  {dest.city}
                </h3>
                <p className="text-white/70 text-sm">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
