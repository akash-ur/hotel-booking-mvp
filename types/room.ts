export interface Room {
  id: string;
  hotelId: string;
  name: string; // e.g. "Deluxe King Room"
  type: "Standard" | "Deluxe" | "Suite" | "Executive";
  maxGuests: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  available: boolean; // base mock availability flag
}
