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
 *
 * BE-6: Booking Creation Endpoint — MVP version, NO PAYMENT
 *
 * MVP behaviour:
 * - No Payments module yet — booking is created directly as CONFIRMED.
 * - Re-checks availability server-side before creating the booking.
 * - Prevents overlapping bookings for the same room.
 */
export async function POST(request: NextRequest) {
  try {
    // -----------------------------------------------------------------------
    // Authentication
    // -----------------------------------------------------------------------
    const userId = getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to book",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------------------------------------
    // Validate request body
    // -----------------------------------------------------------------------
    const body = await request.json();

    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid booking data",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { hotelId, roomId, checkIn, checkOut, guests } = parsed.data;

    // -----------------------------------------------------------------------
    // Validate room capacity
    // -----------------------------------------------------------------------
    const room = getRoomById(roomId);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          error: "Room not found",
        },
        { status: 404 }
      );
    }

    if (guests > room.maxGuests) {
      return NextResponse.json(
        {
          success: false,
          error: `This room fits up to ${room.maxGuests} guests`,
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------------------------
    // Re-check availability using hotel adapter
    // -----------------------------------------------------------------------
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
          error:
            availability.reason ??
            "Room is no longer available for these dates",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------------------------------
    // Check existing bookings for overlapping dates
    //
    // Existing booking:
    //   checkIn  < requested checkOut
    //   checkOut > requested checkIn
    //
    // This blocks:
    //   10-11 vs 10-11
    //   10-11 vs 10-12
    //   10-11 vs 11-12  -> allowed (back-to-back)
    //   10-11 vs 09-10  -> allowed (back-to-back)
    // -----------------------------------------------------------------------
    const overlappingBooking = await prisma.hotelBooking.findFirst({
      where: {
        roomId,
        status: "CONFIRMED",
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Room is already booked for the selected dates",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------------------------------
    // Create booking
    // -----------------------------------------------------------------------
    const booking = await prisma.hotelBooking.create({
      data: {
        userId,
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: enrichBooking(booking),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 *
 * BE-8: List authenticated user's bookings
 */
export async function GET() {
  try {
    const userId = getCurrentUserId();

    const bookings = await prisma.hotelBooking.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: bookings.map(enrichBooking),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching bookings failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load bookings",
      },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// Enrich booking with hotel/room display information
// -----------------------------------------------------------------------------
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
      (booking.checkOut.getTime() - booking.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = room
    ? room.pricePerNight * nights
    : undefined;

  return {
    ...booking,
    hotelName: hotel?.name,
    roomName: room?.name,
    totalPrice,
  };
}