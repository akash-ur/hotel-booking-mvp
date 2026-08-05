import { z } from "zod";
export const searchFormSchema = z
  .object({
    destination: z
      .string()
      .min(2, "Destination must be at least 2 characters")
      .max(100, "Destination is too long"),

    checkIn: z.coerce.date({
      required_error: "Check-in date is required",
      invalid_type_error: "Invalid check-in date",
    }),

    checkOut: z.coerce.date({
      required_error: "Check-out date is required",
      invalid_type_error: "Invalid check-out date",
    }),

    guests: z.coerce
      .number({ invalid_type_error: "Guests must be a number" })
      .int("Guests must be a whole number")
      .min(1, "At least 1 guest is required")
      .max(10, "Maximum 10 guests per booking"),
  })
  .refine((data) => data.checkIn < data.checkOut, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  })
  .refine(
    (data) => data.checkIn >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "Check-in date cannot be in the past",
      path: ["checkIn"],
    }
  );

export type SearchFormValues = z.infer<typeof searchFormSchema>;

// ---------------------------------------------------------------------------
// Availability check schema (FE-4 / BE-5)
// ---------------------------------------------------------------------------
export const availabilitySchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
});

export type AvailabilityValues = z.infer<typeof availabilitySchema>;

// ---------------------------------------------------------------------------
// Booking creation schema (FE-5 / BE-6)
// NOTE: no payment fields — MVP has no payment gateway yet. userId is
// hardcoded on the server for now since Identity/auth module isn't wired up.
// ---------------------------------------------------------------------------
export const createBookingSchema = z
  .object({
    hotelId: z.string().min(1, "Hotel is required"),
    roomId: z.string().min(1, "Room is required"),
    checkIn: z.coerce.date({ required_error: "Check-in date is required" }),
    checkOut: z.coerce.date({ required_error: "Check-out date is required" }),
    guests: z.coerce
      .number()
      .int()
      .min(1, "At least 1 guest is required")
      .max(10, "Maximum 10 guests per booking"),
  })
  .refine((data) => data.checkIn < data.checkOut, {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export type CreateBookingValues = z.infer<typeof createBookingSchema>;
