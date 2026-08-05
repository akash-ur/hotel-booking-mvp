"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function fetchBooking(id: string): Promise<Booking> {
  const res = await fetch(`/api/bookings/${id}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Booking not found");
  }
  return json.data;
}
export default function BookingConfirmationPage() {
  const params = useParams<{ id: string }>();

  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ["booking", params.id],
    queryFn: () => fetchBooking(params.id),
  });

  if (isLoading) {
    return <p className="text-center py-16 text-gray-500">Loading...</p>;
  }

  if (isError || !booking) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Booking not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Card>
        <CardContent className="pt-8 text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-xl font-bold">Booking Confirmed</h1>
          <p className="text-gray-500 text-sm">
            Reference:{" "}
            <span className="font-mono text-gray-800">{booking.id}</span>
          </p>

          <div className="text-left bg-gray-50 rounded-lg p-4 space-y-1 text-sm mt-4">
            <p className="font-medium">{booking.hotelName}</p>
            <p>{booking.roomName}</p>
            <p>
              {new Date(booking.checkIn).toLocaleDateString()} →{" "}
              {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p>
              {booking.guests} guest{booking.guests > 1 ? "s" : ""}
            </p>
            {booking.totalPrice !== undefined && (
              <p className="pt-2 border-t mt-2 font-semibold">
                Total: ${booking.totalPrice}
              </p>
            )}
            <p className="text-xs text-gray-400 uppercase tracking-wide pt-1">
              Status: {booking.status}
            </p>
          </div>

          <Link href="/">
            <Button className="w-full mt-4">Back to Search</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
