# Hotel Booking Module — MVP (Phase 1)

Built against `hotels-module-docs.md`, scoped to exactly what was discussed
in the meeting: search → hotel detail → room selection → booking
confirmation. **No payment, no real auth, no real vendor — all mocked.**

## What's included

| Area | Doc ref | Status |
|---|---|---|
| Search form + results | FE-1 / BE-2 | ✅ |
| Hotel detail page (gallery, description, amenities) | FE-3 / BE-4 | ✅ |
| Room selection + availability check | FE-4 / BE-5 | ✅ |
| Booking creation (**no payment gateway**) | FE-5 / BE-6 | ✅ simplified |
| Booking confirmation screen | FE-6 | ✅ |
| Swappable hotel data adapter | BE-1 | ✅ (`lib/hotel-adapter.ts`) |
| `hotel_bookings` table via Prisma | BE-9 | ✅ |

## Deliberately skipped for this phase

- ❌ **Payments (Razorpay)** — `BookingPanel` confirms bookings directly;
  status goes straight to `CONFIRMED`. When Payments is ready, only
  `app/api/bookings/route.ts` needs to change (set status to `PENDING`,
  call the Payments contract, flip to `CONFIRMED` on webhook).
- ❌ **Real auth (Clerk)** — `lib/auth.ts` returns a hardcoded demo user ID.
  Swap `getCurrentUserId()` for a real session call later; nothing else
  in the booking flow changes.
- ❌ **Filters panel (FE-2)** — not mentioned in the meeting; confirm with
  team lead if it's needed in this phase or the next.
- ❌ **My Bookings page (FE-7)** — backend endpoints (`GET /api/bookings`,
  `GET /api/bookings/:id`) already exist, just no page built yet.
- ❌ **Notifications hand-off (BE-7)** — noted with a comment in the
  booking route where the `booking.confirmed` event would fire.
- ❌ **Real hotel vendor (TBO/HotelBeds/etc.)** — `MockHotelAdapter` in
  `lib/hotel-adapter.ts` is the only thing to replace later. All routes
  and components call the `HotelAdapter` interface, never mock data
  directly — swapping vendors won't touch frontend or route code.

## Project structure

```
prisma/schema.prisma          HotelBooking model
types/                        hotel.ts, room.ts, booking.ts
data/                         hotels.ts, rooms.ts (mock data + helpers)
lib/
  hotel-adapter.ts            ⭐ swappable data source interface (BE-1)
  validations.ts              Zod schemas (search, availability, booking)
  auth.ts                     dummy getCurrentUserId() stub
  prisma.ts                   Prisma client singleton
  utils.ts                    cn() helper for shadcn components
components/
  ui/                         shadcn primitives (button, input, label, form, card)
  Providers.tsx                React Query provider
  SearchForm.tsx               FE-1
  HotelCard.tsx                FE-1 result card
  RoomCard.tsx                 FE-4
  BookingPanel.tsx             FE-5
app/
  page.tsx                     homepage (search hero)
  hotels/page.tsx               FE-1 results page
  hotels/[id]/page.tsx           FE-3 + FE-4 detail + room selection
  bookings/confirmation/[id]/page.tsx   FE-6
  api/hotels/route.ts            BE-2 search
  api/hotels/[id]/route.ts        BE-4 detail
  api/availability/route.ts       BE-5
  api/bookings/route.ts           BE-6 + BE-8 (POST create, GET list)
  api/bookings/[id]/route.ts      BE-8 (GET single)
```

## Setup

```bash
npm install

# Copy env file and add your Supabase Postgres connection string
cp .env.example .env

npx prisma generate
npx prisma migrate dev --name init_hotel_booking

npm run dev
```

Open `http://localhost:3000` → search → click a hotel → select a room →
confirm booking → see the confirmation screen.

## Flow walkthrough

1. **`/`** — search form (destination, check-in, check-out, guests)
2. **`/hotels?...`** — results grid, fetched via React Query from `/api/hotels`
3. **`/hotels/[id]`** — gallery, description, amenities, room list; selecting
   a room triggers `POST /api/availability`
4. Once a room is confirmed available, the **Booking Summary** panel appears
   → **Confirm Booking** calls `POST /api/bookings` (server re-checks
   availability again before creating the record, per BE-6)
5. **`/bookings/confirmation/[id]`** — final confirmation screen

## Notes on mock behavior

- `room-003` (Standard Twin Room, Grand Meridian) is hardcoded `available: false`
  to demo the sold-out state.
- Rooms priced above $400/night are simulated as unavailable for
  **weekend check-ins** — a rule in `MockHotelAdapter.checkAvailability()` —
  just to demonstrate a dynamic "unavailable" case beyond the static flag.
- Booking creation supports a basic idempotency key (`x-idempotency-key`
  header) so retrying a dropped request won't create a duplicate booking.
