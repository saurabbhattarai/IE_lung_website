import nodemailer from "nodemailer";
import { getContactAdminTemplate } from "./templates/contact-admin-template";
import { getContactUserTemplate } from "./templates/contact-email-template";
import { getBookingAdminTemplate } from "./templates/book-admin-template";
import { getBookingUserTemplate } from "./templates/book-user-template";

// Create reusable SMTP transporter using Outlook / Microsoft 365 settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const fromAddress = process.env.SMTP_FROM || "no-reply@ielung.com";
const fromName = "IE Lung & Sleep Institute";
const ownerEmail = process.env.CONTACT_TO || "contact@ielung.com";

// CONTACT FORM EMAIL
export async function sendContactEmails(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = data;

  const results = await Promise.all([
    // Email to admin/owner
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: ownerEmail,
      subject: `New Contact Form: ${name}`,
      html: getContactAdminTemplate({ name, email, message }),
    }),
    // Confirmation email to user
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: email,
      subject: "Message Received | IE Lung",
      html: getContactUserTemplate({ name, message }),
    }),
  ]);

  return results;
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

  const results = await Promise.all([
    // Email to admin/owner
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: ownerEmail,
      subject: `New Appointment: ${patientName}`,
      html: getBookingAdminTemplate({
        patientName,
        email,
        phone,
        reason,
        preferredDate,
        preferredTime,
      }),
    }),
    // Confirmation email to user
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: email,
      subject: "Appointment Request Received | IE Lung",
      html: getBookingUserTemplate({
        patientName,
        reason,
        preferredDate,
        preferredTime,
      }),
    }),
  ]);

  return results;
}
