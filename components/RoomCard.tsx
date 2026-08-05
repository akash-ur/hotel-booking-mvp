"use client";

import { Room } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  isCheckingAvailability: boolean;
  unavailableReason?: string; // set after a failed availability check for this room
  onSelect: (roomId: string) => void;
}

/**
 * FE-4: Room Selection UI.
 * "Book Now" / select action triggers an availability check (handled by
 * the parent). Clearly shows an unavailable state and prompts a different
 * room when the check fails.
 */
export default function RoomCard({
  room,
  isSelected,
  isCheckingAvailability,
  unavailableReason,
  onSelect,
}: RoomCardProps) {
  const isKnownUnavailable = !room.available; // static mock flag, known upfront

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${isKnownUnavailable ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full sm:w-48 h-40 sm:h-auto object-cover"
        />
        <CardContent className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 sm:pt-4">
          <div>
            <h4 className="font-semibold">{room.name}</h4>
            <p className="text-sm text-gray-500">
              {room.type} · Up to {room.maxGuests} guests
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {room.amenities.join(" · ")}
            </p>

            {isKnownUnavailable && (
              <p className="text-sm text-red-500 mt-2 font-medium">
                Sold out for these dates
              </p>
            )}

            {!isKnownUnavailable && unavailableReason && (
              <p className="text-sm text-red-500 mt-2 font-medium">
                {unavailableReason} — please choose a different room
              </p>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className="font-bold text-blue-600 text-lg">
              ${room.pricePerNight}
              <span className="text-xs text-gray-400 font-normal"> /night</span>
            </p>
            <Button
              className="mt-2"
              size="sm"
              disabled={isKnownUnavailable || isCheckingAvailability}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(room.id)}
            >
              {isCheckingAvailability && isSelected
                ? "Checking..."
                : isSelected
                ? "Selected"
                : "Select Room"}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
