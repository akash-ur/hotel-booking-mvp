import { Hotel } from "@/types/hotel";

export const hotels: Hotel[] = [
  {
    id: "hotel-001",
    name: "The Grand Meridian",
    description:
      "A luxury 5-star hotel in the heart of downtown, offering skyline views, a rooftop infinity pool, and award-winning dining.",
    location: "123 Fifth Avenue",
    city: "New York",
    country: "USA",
    rating: 4.8,
    pricePerNight: 320,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    ],
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Room Service", "Parking"],
    roomIds: ["room-001", "room-002", "room-003"],
  },
  {
    id: "hotel-002",
    name: "Seaside Palm Resort",
    description:
      "A beachfront resort with private cabanas, water sports, and direct access to a white-sand beach — perfect for family getaways.",
    location: "45 Ocean Drive",
    city: "Bali",
    country: "Indonesia",
    rating: 4.6,
    pricePerNight: 210,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    ],
    amenities: ["Free WiFi", "Private Beach", "Pool", "Bar", "Breakfast Included"],
    roomIds: ["room-004", "room-005"],
  },
  {
    id: "hotel-003",
    name: "Royal hotel",
    description:
      "A cozy mountain lodge with fireplace suites, ski-in/ski-out access, and panoramic views of the surrounding peaks.",
    location: "9 Summit Road",
    city: "Noida",
    country: "india",
    rating: 4.7,
    pricePerNight: 275,
    images: [
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8",
      "https://images.unsplash.com/photo-1548704806-074f8636e12e",
    ],
    amenities: ["Free WiFi", "Fireplace", "Ski Access", "Sauna", "Restaurant"],
    roomIds: ["room-006", "room-007"],
  },
];

// Helper — simulates what a real adapter's getById would do
export function getHotelById(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}
