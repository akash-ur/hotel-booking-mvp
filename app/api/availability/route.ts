import { NextRequest, NextResponse } from "next/server";
import { hotelAdapter } from "@/lib/hotel-adapter";
import { availabilitySchema } from "@/lib/validations";

/**
 * POST /api/availability
 * Body: { hotelId, roomId, checkIn, checkOut }
 * (BE-5: Availability Check Endpoint)
 *
 * Triggered when the user selects a room on the detail page (FE-4).
 * This is checked AGAIN, server-side, at booking time in
 * /api/bookings — this endpoint alone is not sufficient to guarantee
 * the room is still free by the time the user actually books.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = availabilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid availability request", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { hotelId, roomId, checkIn, checkOut } = parsed.data;

    const result = await hotelAdapter.checkAvailability({
      hotelId,
      roomId,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Availability check failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
