import { hotels, getHotelById } from "@/data/hotels";
import { getRoomsByHotelId, getRoomById } from "@/data/rooms";
import { Hotel, HotelSearchResult } from "@/types/hotel";
import { Room } from "@/types/room";

export interface HotelSearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export interface AvailabilityParams {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string; // e.g. "Room does not accept this many guests"
}

export interface HotelAdapter {
  search(params: HotelSearchParams): Promise<HotelSearchResult[]>;
  getHotelDetail(hotelId: string): Promise<Hotel | null>;
  getRooms(hotelId: string): Promise<Room[]>;
  checkAvailability(params: AvailabilityParams): Promise<AvailabilityResult>;
}

/**
 * Mock implementation — used until a real aggregator vendor is picked.
 * Simulates network latency so loading states are visible in dev.
 */
class MockHotelAdapter implements HotelAdapter {
  private async simulateLatency(ms = 500) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async search(params: HotelSearchParams): Promise<HotelSearchResult[]> {
    await this.simulateLatency();

    const destination = params.destination?.toLowerCase().trim();
    let results = hotels;

    if (destination) {
      results = hotels.filter(
        (hotel) =>
          hotel.city.toLowerCase().includes(destination) ||
          hotel.country.toLowerCase().includes(destination) ||
          hotel.name.toLowerCase().includes(destination)
      );
    }

    // Filter out hotels that have zero rooms fitting the requested guest count
    if (params.guests) {
      results = results.filter((hotel) => {
        const hotelRooms = getRoomsByHotelId(hotel.id);
        return hotelRooms.some((r) => r.maxGuests >= params.guests!);
      });
    }

    return results.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      rating: hotel.rating,
      startingPrice: hotel.pricePerNight,
      image: hotel.images[0],
    }));
  }

  async getHotelDetail(hotelId: string): Promise<Hotel | null> {
    await this.simulateLatency(300);
    return getHotelById(hotelId) ?? null;
  }

  async getRooms(hotelId: string): Promise<Room[]> {
    await this.simulateLatency(300);
    return getRoomsByHotelId(hotelId);
  }

  async checkAvailability(
    params: AvailabilityParams
  ): Promise<AvailabilityResult> {
    await this.simulateLatency(400);

    const room = getRoomById(params.roomId);

    if (!room || room.hotelId !== params.hotelId) {
      return { available: false, reason: "Room not found for this hotel" };
    }

    if (!room.available) {
      return { available: false, reason: "Room is sold out for these dates" };
    }

    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);

    if (checkIn >= checkOut) {
      return { available: false, reason: "Invalid date range" };
    }

    // Mock rule: rooms priced above $400/night are simulated as fully
    // booked on weekends, just to demonstrate a real "unavailable" case
    // beyond the static `available` flag.
    const isWeekendCheckIn = [0, 6].includes(checkIn.getDay());
    if (room.pricePerNight > 400 && isWeekendCheckIn) {
      return {
        available: false,
        reason: "Not available for weekend check-in — try a weekday",
      };
    }

    return { available: true };
  }
}

// Swap this line when a real vendor adapter is ready, e.g.:
// export const hotelAdapter: HotelAdapter = new HotelBedsAdapter();
export const hotelAdapter: HotelAdapter = new MockHotelAdapter();
