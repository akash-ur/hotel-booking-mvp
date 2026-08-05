import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hotelAdapter } from "@/lib/hotel-adapter";
import { createBookingSchema } from "@/lib/validations";
import { getCurrentUserId } from "@/lib/auth";
import { getHotelById } from "@/data/hotels";
import { getRoomById } from "@/data/rooms";

/**
 * POST /api/bookings
 * Body: { hotelId, roomId, checkIn, checkOut, guests }
 * (BE-6: Booking Creation Endpoint — MVP version, NO PAYMENT)
 *
 * MVP behaviour differs from the full doc spec (BE-6) on purpose:
 * - No Payments module hand-off yet — booking is created straight to
 *   CONFIRMED status instead of "awaiting payment".
 * - Still re-checks availability server-side before creating the record
 *   (never trusts the earlier /api/availability call).
 * - Still supports a basic idempotency key so a dropped-connection retry
 *   doesn't create a duplicate booking.
 *
 * When the Payments module is ready: change `status: "CONFIRMED"` below
 * to `"PENDING"`, call the Payments contract, and let the webhook flip
 * it to CONFIRMED — the rest of this route stays the same.
 */
export async function POST(request: NextRequest) {
  try {
    // Requires an authenticated user (BE-6). Real auth isn't wired up yet,
    // so this always resolves to a dummy demo user — see lib/auth.ts.
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to book" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid booking data", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { hotelId, roomId, checkIn, checkOut, guests } = parsed.data;

    // --- Idempotency guard -------------------------------------------------
    // Client sends the same key on retry (e.g. after a dropped connection).
    // If a booking with this exact key already exists, return it instead
    // of creating a duplicate. For MVP we derive a natural key from the
    // request itself since there's no payment session id yet.
    const idempotencyKey = request.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const existing = await prisma.hotelBooking.findFirst({
        where: {
          userId,
          hotelId,
          roomId,
          checkIn,
          checkOut,
        },
      });
      if (existing) {
        return NextResponse.json(
          { success: true, data: enrichBooking(existing) },
          { status: 200 }
        );
      }
    }

    // --- Re-check availability server-side (do NOT trust the FE-4 check) --
    const availability = await hotelAdapter.checkAvailability({
      hotelId,
      roomId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    });

    if (!availability.available) {
      return NextResponse.json(
        {
          success: false,
          error: availability.reason ?? "Room is no longer available for these dates",
        },
        { status: 409 } // Conflict — most accurate status for "no longer available"
      );
    }

    const room = getRoomById(roomId);
    if (room && guests > room.maxGuests) {
      return NextResponse.json(
        { success: false, error: `This room fits up to ${room.maxGuests} guests` },
        { status: 400 }
      );
    }

    // --- Create the booking -------------------------------------------------
    const booking = await prisma.hotelBooking.create({
      data: {
        userId,
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests,
        status: "CONFIRMED", // MVP: no payment step yet — see note above
      },
    });

    // BE-7 note: in the real flow, this is where a `booking.confirmed`
    // event would fire for the Notifications module. Skipped for MVP.

    return NextResponse.json(
      { success: true, data: enrichBooking(booking) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * (BE-8: list the authenticated user's bookings)
 */
export async function GET() {
  try {
    const userId = getCurrentUserId();

    const bookings = await prisma.hotelBooking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: bookings.map(enrichBooking) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching bookings failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}

// Attaches display-friendly hotel/room names + total price to a raw
// booking row, since the DB only stores IDs (per BE-9).
function enrichBooking(booking: {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: string;
  createdAt: Date;
}) {
  const hotel = getHotelById(booking.hotelId);
  const room = getRoomById(booking.roomId);

  const nights = Math.max(
    1,
    Math.round(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const totalPrice = room ? room.pricePerNight * nights : undefined;

  return {
    ...booking,
    hotelName: hotel?.name,
    roomName: room?.name,
    totalPrice,
  };
}
