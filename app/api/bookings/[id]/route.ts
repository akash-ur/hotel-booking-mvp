import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { getHotelById } from "@/data/hotels";
import { getRoomById } from "@/data/rooms";

/**
 * GET /api/bookings/:id
 * (BE-8: retrieve a single booking, restricted to its owner)
 * Used by the confirmation screen (FE-6) and "My Bookings" detail view (FE-7).
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getCurrentUserId();

    const booking = await prisma.hotelBooking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Restricted to the booking's owner, per BE-8
    if (booking.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "You don't have access to this booking" },
        { status: 403 }
      );
    }

    const hotel = getHotelById(booking.hotelId);
    const room = getRoomById(booking.roomId);
    const nights = Math.max(
      1,
      Math.round(
        (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...booking,
          hotelName: hotel?.name,
          hotelCity: hotel?.city,
          roomName: room?.name,
          totalPrice: room ? room.pricePerNight * nights : undefined,
          nights,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetching booking failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load booking" },
      { status: 500 }
    );
  }
}
