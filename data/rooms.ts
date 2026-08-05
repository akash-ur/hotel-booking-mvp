import { Room } from "@/types/room";

export const rooms: Room[] = [
  // The Grand Meridian (hotel-001)
  {
    id: "room-001",
    hotelId: "hotel-001",
    name: "Deluxe King Room",
    type: "Deluxe",
    maxGuests: 2,
    pricePerNight: 320,
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32"],
    amenities: ["King Bed", "City View", "Mini Bar"],
    available: true,
  },
  {
    id: "room-002",
    hotelId: "hotel-001",
    name: "Executive Suite",
    type: "Executive",
    maxGuests: 3,
    pricePerNight: 480,
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427"],
    amenities: ["King Bed", "Living Area", "Skyline View"],
    available: true,
  },
  {
    id: "room-003",
    hotelId: "hotel-001",
    name: "Standard Twin Room",
    type: "Standard",
    maxGuests: 2,
    pricePerNight: 260,
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"],
    amenities: ["Twin Beds", "Work Desk"],
    available: false, // deliberately unavailable — used to demo the "sold out" state
  },
  // Seaside Palm Resort (hotel-002)
  {
    id: "room-004",
    hotelId: "hotel-002",
    name: "Ocean View Bungalow",
    type: "Suite",
    maxGuests: 4,
    pricePerNight: 210,
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd"],
    amenities: ["Ocean View", "Private Terrace", "Hammock"],
    available: true,
  },
  {
    id: "room-005",
    hotelId: "hotel-002",
    name: "Garden Deluxe Room",
    type: "Deluxe",
    maxGuests: 2,
    pricePerNight: 165,
    images: ["https://images.unsplash.com/photo-1611048267451-e6ed903d4a38"],
    amenities: ["Garden View", "Outdoor Shower"],
    available: true,
  },
  // Alpine Ridge Lodge (hotel-003)
  {
    id: "room-006",
    hotelId: "hotel-003",
    name: "Fireplace Suite",
    type: "Suite",
    maxGuests: 4,
    pricePerNight: 275,
    images: ["https://images.unsplash.com/photo-1601918774946-25832a4be0d6"],
    amenities: ["Fireplace", "Mountain View", "Bathtub"],
    available: true,
  },
  {
    id: "room-007",
    hotelId: "hotel-003",
    name: "Standard Alpine Room",
    type: "Standard",
    maxGuests: 2,
    pricePerNight: 190,
    images: ["https://images.unsplash.com/photo-1595576508898-0ad5c879a061"],
    amenities: ["Mountain View", "Heating"],
    available: true,
  },
];

// Helpers — simulate what a real adapter's room operations would do
export function getRoomsByHotelId(hotelId: string): Room[] {
  return rooms.filter((r) => r.hotelId === hotelId);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
