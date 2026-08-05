import { NextRequest, NextResponse } from "next/server";
import { hotelAdapter } from "@/lib/hotel-adapter";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const destination = searchParams.get("destination") ?? undefined;
  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const guestsRaw = searchParams.get("guests");
  const guests = guestsRaw ? Number(guestsRaw) : undefined;

  
  if (guests !== undefined && (Number.isNaN(guests) || guests < 1)) {
    return NextResponse.json(
      { success: false, error: "Invalid guest count" },
      { status: 400 }
    );
  }

  if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
    return NextResponse.json(
      { success: false, error: "Check-out must be after check-in" },
      { status: 400 }
    );
  }

  try {
    const results = await hotelAdapter.search({
      destination,
      checkIn,
      checkOut,
      guests,
    });

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error) {
    // Handles adapter/provider failure per BE-2 — page shouldn't break
    console.error("Hotel search failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hotels. Please try again." },
      { status: 500 }
    );
  }
}
