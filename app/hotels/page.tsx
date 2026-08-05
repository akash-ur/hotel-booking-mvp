"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HotelSearchResult } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";
import { Button } from "@/components/ui/button";

async function fetchHotels(params: URLSearchParams): Promise<HotelSearchResult[]> {
  const res = await fetch(`/api/hotels?${params.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to fetch hotels");
  }
  return json.data;
}

function HotelResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destination = searchParams.get("destination") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = searchParams.get("guests") ?? "1";

  const {
    data: hotels,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotels", destination, checkIn, checkOut, guests],
    queryFn: () => fetchHotels(searchParams),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {destination ? `Hotels in "${destination}"` : "All Hotels"}
          </h1>
          {checkIn && checkOut && (
            <p className="text-sm text-gray-500 mt-1">
              {checkIn} → {checkOut} · {guests} guest{Number(guests) > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>
          New Search
        </Button>
      </div>

      {/* FE-1: loading state */}
      {isLoading && (
        <p className="text-center text-gray-500 py-16 animate-pulse">
          Searching hotels...
        </p>
      )}

      {/* FE-1: error state */}
      {isError && (
        <div className="text-center py-16">
          <p className="text-red-500">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      )}

      {/* FE-1: empty state */}
      {!isLoading && !isError && hotels?.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No hotels found. Try a different destination or fewer guests.
        </p>
      )}

      {hotels && hotels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

// useSearchParams requires a Suspense boundary in the App Router
export default function HotelsPage() {
  return (
    <Suspense fallback={<p className="text-center py-16">Loading...</p>}>
      <HotelResults />
    </Suspense>
  );
}
