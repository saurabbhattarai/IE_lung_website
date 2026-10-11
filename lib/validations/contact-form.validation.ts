import { z } from "zod";
import {
  AFTERNOON_BOOKING_SLOTS,
  MIN_BOOKING_DATE,
  MORNING_BOOKING_SLOTS,
} from "../constants/booking";

// contact form validation
export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(20),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
});

// booking form validation
export const BookingSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Invalid email address"),
  reason: z.string().min(1, "Please select a service"),
  preferredDate: z
    .string()
    .date("Please select a valid date")
    .refine(
      (date) => date >= MIN_BOOKING_DATE,
      "Please select a date on or after November 2, 2026",
    ),
  preferredTime: z.enum([
    ...MORNING_BOOKING_SLOTS,
    ...AFTERNOON_BOOKING_SLOTS,
  ]),
});

export type ContactFormData = z.infer<typeof ContactSchema>;
export type BookingFormData = z.infer<typeof BookingSchema>;
