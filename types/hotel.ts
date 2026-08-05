export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  rating: number; // 1-5
  pricePerNight: number; // base/starting price, currency = USD
  images: string[];
  amenities: string[];
  roomIds: string[]; // references Room.id in room.ts
}

// Slim version used in search result cards (list view) —
// mirrors what a real aggregator's search endpoint typically returns
// (full details only load on the detail page, not in the list).
export interface HotelSearchResult {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  startingPrice: number;
  image: string;
}
