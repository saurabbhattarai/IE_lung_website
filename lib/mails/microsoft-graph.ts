import "server-only";

import { getContactAdminTemplate } from "./templates/contact-admin-template";
import { getContactUserTemplate } from "./templates/contact-email-template";
import { getBookingAdminTemplate } from "./templates/book-admin-template";
import { getBookingUserTemplate } from "./templates/book-user-template";
import { escapeHtml } from "./html";

const graphBaseUrl = "https://graph.microsoft.com/v1.0";
const ownerEmail = process.env.CONTACT_TO || "contact@ielung.com";

type GraphTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GraphErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function getAccessToken(): Promise<string> {
  const tenantId = getRequiredEnvironmentVariable("MICROSOFT_TENANT_ID");
  const clientId = getRequiredEnvironmentVariable("MICROSOFT_CLIENT_ID");
  const clientSecret = getRequiredEnvironmentVariable(
    "MICROSOFT_CLIENT_SECRET",
  );
  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(
    tenantId,
  )}/oauth2/v2.0/token`;
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    throw new Error(
      `Microsoft identity token request failed with status ${tokenResponse.status}`,
    );
  }

  const token = (await tokenResponse.json()) as GraphTokenResponse;
  if (!token.access_token) {
    throw new Error(
      `Microsoft identity token response did not include an access token${
        token.error ? ` (${token.error})` : ""
      }`,
    );
  }

  return token.access_token;
}

async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  accessToken,
  senderEmail,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  accessToken: string;
  senderEmail: string;
}): Promise<void> {
  const response = await fetch(
    `${graphBaseUrl}/users/${encodeURIComponent(senderEmail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          toRecipients: [{ emailAddress: { address: to } }],
          ...(replyTo && {
            replyTo: [{ emailAddress: { address: replyTo } }],
          }),
        },
        saveToSentItems: true,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const responseBody = await response.text();
    let graphError: GraphErrorResponse | undefined;

    try {
      graphError = JSON.parse(responseBody) as GraphErrorResponse;
    } catch {
      // Some gateways return non-JSON error pages.
    }

    const details = [
      graphError?.error?.code,
      graphError?.error?.message ?? responseBody.slice(0, 500),
      response.headers.get("request-id"),
    ].filter(Boolean);

    throw new Error(
      `Microsoft Graph email send failed with status ${response.status}${
        details.length ? `: ${details.join(" | ")}` : ""
      }`,
    );
  }
}

// CONTACT FORM EMAIL
export async function sendContactEmails(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const senderEmail = getRequiredEnvironmentVariable(
    "MICROSOFT_SENDER_EMAIL",
  );
  const accessToken = await getAccessToken();
  const safeData = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    message: escapeHtml(data.message),
  };

  await Promise.all([
    sendEmail({
      to: ownerEmail,
      replyTo: data.email,
      subject: `New Contact Form: ${data.name}`,
      html: getContactAdminTemplate(safeData),
      accessToken,
      senderEmail,
    }),
    sendEmail({
      to: data.email,
      subject: "Message Received | IE Lung",
      html: getContactUserTemplate({
        name: safeData.name,
        message: safeData.message,
      }),
      accessToken,
      senderEmail,
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
}): Promise<void> {
  const senderEmail = getRequiredEnvironmentVariable(
    "MICROSOFT_SENDER_EMAIL",
  );
  const accessToken = await getAccessToken();
  const safeData = {
    patientName: escapeHtml(data.patientName),
    phone: escapeHtml(data.phone),
    reason: escapeHtml(data.reason),
    preferredDate: escapeHtml(data.preferredDate),
    preferredTime: escapeHtml(data.preferredTime),
    email: escapeHtml(data.email),
  };

  await Promise.all([
    sendEmail({
      to: ownerEmail,
      replyTo: data.email,
      subject: `New Appointment: ${data.patientName}`,
      html: getBookingAdminTemplate(safeData),
      accessToken,
      senderEmail,
    }),
    sendEmail({
      to: data.email,
      subject: "Appointment Request Received | IE Lung",
      html: getBookingUserTemplate({
        patientName: safeData.patientName,
        reason: safeData.reason,
        preferredDate: safeData.preferredDate,
        preferredTime: safeData.preferredTime,
      }),
      accessToken,
      senderEmail,
    }),
  ]);
}
