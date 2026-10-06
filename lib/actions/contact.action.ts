"use server";

import {
  sendContactEmails,
  sendBookingEmails,
} from "@/lib/mails/microsoft-graph";
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

    await sendContactEmails(validatedFields.data);

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

    await sendBookingEmails(validatedFields.data);

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
