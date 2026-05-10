import { Resend } from "resend";
import { getContactAdminTemplate } from "./templates/contact-admin-template";
import { getContactUserTemplate } from "./templates/contact-email-template";
import { getBookingAdminTemplate } from "./templates/book-admin-template";
import { getBookingUserTemplate } from "./templates/book-user-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.CONTACT_FROM!;
const ownerEmail = process.env.CONTACT_TO!;

// CONTACT FORM EMAIL
export async function sendContactEmails(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = data;

  return await Promise.all([
    // To Admin
    resend.emails.send({
      from,
      to: [ownerEmail],
      subject: `New Contact Form: ${name}`,
      html: getContactAdminTemplate({ name, email, message }),
    }),
    // To User
    resend.emails.send({
      from,
      to: [email],
      subject: "Message Received | IE Lung",
      html: getContactUserTemplate({ name, message }),
    }),
  ]);
}

// BOOKING FORM EMAIL
export async function sendBookingEmails(data: {
  patientName: string;
  phone: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  email: string;
}) {
  const { patientName, phone, reason, preferredDate, preferredTime, email } =
    data;

  return await Promise.all([
    // To Admin
    resend.emails.send({
      from,
      to: [ownerEmail],
      subject: `📅 New Appointment: ${patientName}`,
      html: getBookingAdminTemplate({
        patientName,
        email,
        phone,
        reason,
        preferredDate,
        preferredTime,
      }),
    }),
    // To User
    resend.emails.send({
      from,
      to: [email],
      subject: "Appointment Request Received | IE Lung",
      html: getBookingUserTemplate({
        patientName,
        reason,
        preferredDate,
        preferredTime,
      }),
    }),
  ]);
}
