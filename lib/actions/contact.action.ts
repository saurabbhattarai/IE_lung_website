"use server";

import { sendContactEmails, sendBookingEmails } from "@/lib/mails/resend";
import {
  BookingSchema,
  ContactSchema,
} from "../validations/contact-form.validation";

type FormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// CONTACT FORM ACTION
export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = ContactSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const results = await sendContactEmails(validatedFields.data);

    // Check if Resend returned any errors
    if (results.some((res) => res.error)) {
      throw new Error("Email provider error");
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("CONTACT_FORM_ERROR:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}

// BOOKING FORM ACTION
export async function submitBookingForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = BookingSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // Pass all fields to the email helper
    const results = await sendBookingEmails(validatedFields.data);

    if (results.some((res: any) => res.error)) {
      throw new Error("Email provider error");
    }

    return {
      success: true,
      message: "Appointment request sent! We will contact you shortly.",
    };
  } catch (error) {
    console.error("BOOKING_FORM_ERROR:", error);
    return {
      success: false,
      message: "Something went wrong. Please call us directly.",
    };
  }
}
