export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string; // ISO date string over the wire
  checkOut: string;
  guests: number;
  status: BookingStatus;
  createdAt: string;
  // Denormalized display fields — included in API responses so the
  // confirmation/my-bookings screens don't need extra joins on the client.
  hotelName?: string;
  roomName?: string;
  totalPrice?: number;
}
