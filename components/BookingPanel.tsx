"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Hotel } from "@/types/hotel";
import { Room } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingPanelProps {
  hotel: Hotel;
  room: Room;
  checkIn: string; // yyyy-mm-dd
  checkOut: string;
  guests: number;
}

async function createBooking(payload: {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Basic idempotency guard — same key on retry avoids duplicate bookings.
      "x-idempotency-key": `${payload.hotelId}-${payload.roomId}-${payload.checkIn}-${payload.checkOut}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Booking failed");
  }
  return json.data;
}

/**
 * FE-5: Booking summary screen (simplified for MVP — no Payments module yet).
 * "Confirm Booking" creates the booking directly and redirects to the
 * confirmation screen (FE-6). Button is disabled while the request is in
 * flight to prevent duplicate submissions, per FE-5 spec.
 */
export default function BookingPanel({
  hotel,
  room,
  checkIn,
  checkOut,
  guests,
}: BookingPanelProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = room.pricePerNight * nights;

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      router.push(`/bookings/confirmation/${booking.id}`);
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
    },
  });

  const handleConfirm = () => {
    setErrorMsg(null);
    mutation.mutate({
      hotelId: hotel.id,
      roomId: room.id,
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <Card className="sticky top-6">
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-semibold text-lg">Booking Summary</h3>

        <div className="text-sm space-y-1 text-gray-600">
          <p className="font-medium text-gray-900">{hotel.name}</p>
          <p>{room.name}</p>
          <p>
            {checkIn} → {checkOut} · {nights} night{nights > 1 ? "s" : ""}
          </p>
          <p>
            {guests} guest{guests > 1 ? "s" : ""}
          </p>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-500 bg-red-50 rounded-md p-2">
            {errorMsg}
          </p>
        )}

        {/* No payment gateway yet — this directly confirms the booking. */}
        <Button
          className="w-full"
          onClick={handleConfirm}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Confirming..." : "Confirm Booking"}
        </Button>

        <p className="text-xs text-gray-400 text-center">
        No payment required. Booking will be confirmed instantly.
        </p>
      </CardContent>
    </Card>
  );
}
