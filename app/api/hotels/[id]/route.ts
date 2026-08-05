import { NextResponse } from "next/server";
import { hotelAdapter } from "@/lib/hotel-adapter";

/**
 * GET /api/hotels/:id
 * (BE-4: Hotel Detail Endpoint)
 *
 * Returns hotel details + its room list together, so the detail page
 * (FE-3) can render photos, description, amenities, and room options
 * from a single request.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await hotelAdapter.getHotelDetail(params.id);

    if (!hotel) {
      // Clear "not found" response per BE-4 done criteria
      return NextResponse.json(
        { success: false, error: "Hotel not found" },
        { status: 404 }
      );
    }

    const rooms = await hotelAdapter.getRooms(params.id);

    return NextResponse.json(
      { success: true, data: { hotel, rooms } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Hotel detail fetch failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load hotel details" },
      { status: 500 }
    );
  }
}
