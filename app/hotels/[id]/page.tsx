"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Hotel } from "@/types/hotel";
import { Room } from "@/types/room";
import RoomCard from "@/components/RoomCard";
import BookingPanel from "@/components/BookingPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function fetchHotelDetail(
  id: string
): Promise<{ hotel: Hotel; rooms: Room[] }> {
  const res = await fetch(`/api/hotels/${id}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to load hotel");
  }
  return json.data;
}

async function checkAvailability(payload: {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
}) {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Availability check failed");
  }
  return json.data as { available: boolean; reason?: string };
}

function tomorrow(offsetDays = 1) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function HotelDetail() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") ?? tomorrow(1)
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") ?? tomorrow(2)
  );
  const [guests, setGuests] = useState(
    Number(searchParams.get("guests")) || 1
  );

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [unavailableRoomId, setUnavailableRoomId] = useState<string | null>(
    null
  );
  const [unavailableReason, setUnavailableReason] = useState<string>();
  const [confirmedAvailableRoomId, setConfirmedAvailableRoomId] = useState<
    string | null
  >(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hotel-detail", params.id],
    queryFn: () => fetchHotelDetail(params.id),
  });

  const availabilityMutation = useMutation({
    mutationFn: checkAvailability,
    onSuccess: (result, variables) => {
      if (result.available) {
        setConfirmedAvailableRoomId(variables.roomId);
        setUnavailableRoomId(null);
      } else {
        setUnavailableRoomId(variables.roomId);
        setUnavailableReason(result.reason);
        setConfirmedAvailableRoomId(null);
      }
    },
    onError: (err: Error, variables) => {
      setUnavailableRoomId(variables.roomId);
      setUnavailableReason(err.message);
      setConfirmedAvailableRoomId(null);
    },
  });

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setConfirmedAvailableRoomId(null);
    setUnavailableRoomId(null);
    availabilityMutation.mutate({
      hotelId: params.id,
      roomId,
      checkIn,
      checkOut,
    });
  };

  if (isLoading) {
    return <p className="text-center py-16 text-gray-500">Loading hotel...</p>;
  }

  // FE-3: "hotel unavailable" / error state
  if (isError || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">
          {error instanceof Error ? error.message : "Hotel not found"}
        </p>
      </div>
    );
  }

  const { hotel, rooms } = data;
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const canBook = selectedRoom && confirmedAvailableRoomId === selectedRoom.id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* FE-3: Photo gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden mb-6">
        {hotel.images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={img}
            alt={`${hotel.name} photo ${i + 1}`}
            className={`w-full h-64 object-cover ${i === 0 ? "sm:col-span-2" : ""}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{hotel.name}</h1>
            <p className="text-gray-500">
              {hotel.location}, {hotel.city}, {hotel.country}
            </p>
            <p className="text-yellow-600 font-medium mt-1">
              ⭐ {hotel.rating.toFixed(1)}
            </p>
          </div>

          <p className="text-gray-700">{hotel.description}</p>

          <div>
            <h3 className="font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Date/guest selectors — carried from search, editable here */}
          <div className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label>Check-in</Label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setSelectedRoomId(null);
                  setConfirmedAvailableRoomId(null);
                }}
              />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setSelectedRoomId(null);
                  setConfirmedAvailableRoomId(null);
                }}
              />
            </div>
            <div>
              <Label>Guests</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>

          {/* FE-4: Room selection list */}
          <div>
            <h3 className="font-semibold mb-3">Available Rooms</h3>
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isSelected={selectedRoomId === room.id}
                  isCheckingAvailability={
                    availabilityMutation.isPending &&
                    selectedRoomId === room.id
                  }
                  unavailableReason={
                    unavailableRoomId === room.id ? unavailableReason : undefined
                  }
                  onSelect={handleSelectRoom}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FE-5: Booking summary — only shown once a room is confirmed available */}
        <div>
          {canBook && selectedRoom ? (
            <BookingPanel
              hotel={hotel}
              room={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          ) : (
            <div className="text-sm text-gray-400 border border-dashed rounded-xl p-6 text-center">
              Select an available room to see your booking summary.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailPage() {
  return (
    <Suspense fallback={<p className="text-center py-16">Loading...</p>}>
      <HotelDetail />
    </Suspense>
  );
}
