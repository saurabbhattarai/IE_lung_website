import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.ADMIN_EMAIL = "admin@ielung.com";
process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";
process.env.JWT_SECRET = "super-secret-jwt-key-that-is-at-least-32-chars-long";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  SubscribeNewsletterSchema,
} from "../lib/validations/newsletter.validation.ts";
import {
  subscribeNewsletterService,
  GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE,
} from "../lib/newsletter/service.ts";
import {
  isValidOrigin,
  checkNewsletterRateLimit,
  resetNewsletterRateLimit,
  POST,
} from "../app/api/newsletter/subscribe/route.ts";
import { Prisma } from "@prisma/client";

// ==========================================
// 1. Zod Validation & Normalization
// ==========================================

test("1. Newsletter Validation: Accepts valid email and explicit consent", () => {
  const result = SubscribeNewsletterSchema.safeParse({
    email: "patient@example.com",
    consent: true,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "patient@example.com");
    assert.equal(result.data.consent, true);
  }
});

test("2. Newsletter Validation: Automatically normalizes email (trims and converts to lowercase)", () => {
  const result = SubscribeNewsletterSchema.safeParse({
    email: "   John.Doe@Med.UCLA.EDU   ",
    consent: true,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "john.doe@med.ucla.edu");
  }
});

test("3. Newsletter Validation: Rejects invalid email formats and empty strings", () => {
  const invalidCases = [
    "",
    "   ",
    "plainaddress",
    "#@%^%#$@#$@#.com",
    "@missingusername.com",
    "username@.com",
  ];

  for (const email of invalidCases) {
    const res = SubscribeNewsletterSchema.safeParse({ email, consent: true });
    assert.equal(res.success, false, `Expected '${email}' to be rejected`);
  }
});

test("4. Newsletter Validation: Rejects emails exceeding 255 characters", () => {
  const longEmail = "a".repeat(250) + "@example.com"; // > 255 chars
  const res = SubscribeNewsletterSchema.safeParse({
    email: longEmail,
    consent: true,
  });

  assert.equal(res.success, false);
});

test("5. Newsletter Validation: Rejects missing or false consent", () => {
  // False consent
  const resFalse = SubscribeNewsletterSchema.safeParse({
    email: "patient@example.com",
    consent: false,
  });
  assert.equal(resFalse.success, false);

  // Missing consent
  const resMissing = SubscribeNewsletterSchema.safeParse({
    email: "patient@example.com",
  });
  assert.equal(resMissing.success, false);
});

// ==========================================
// 2. Service Logic: Subscription & Enumeration Prevention
// ==========================================

test("6. Newsletter Service: Creates a new active subscriber in database", async () => {
  let createdData = null;

  prisma.newsletterSubscriber = {
    findUnique: async () => null,
    create: async ({ data }) => {
      createdData = data;
      return { id: "sub-1", ...data };
    },
  };

  const result = await subscribeNewsletterService({
    email: "NewSubscriber@example.com",
    consent: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
  assert.ok(createdData);
  assert.equal(createdData.email, "newsubscriber@example.com");
  assert.equal(createdData.status, "ACTIVE");
  assert.equal(createdData.unsubscribedAt, null);
  assert.ok(createdData.subscribedAt instanceof Date);
});

test("7. Newsletter Service: Duplicate active subscription returns generic success without duplicating", async () => {
  let createCalled = false;
  let updateCalled = false;

  prisma.newsletterSubscriber = {
    findUnique: async () => ({
      id: "sub-active",
      email: "active@example.com",
      status: "ACTIVE",
      subscribedAt: new Date("2026-01-01"),
      unsubscribedAt: null,
    }),
    create: async () => {
      createCalled = true;
    },
    update: async () => {
      updateCalled = true;
    },
  };

  const result = await subscribeNewsletterService({
    email: "active@example.com",
    consent: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
  assert.equal(createCalled, false, "Should not create duplicate record");
  assert.equal(updateCalled, false, "Should not modify active record");
});

test("8. Newsletter Service: Reactivates previously UNSUBSCRIBED subscriber with explicit consent", async () => {
  let updatedData = null;

  prisma.newsletterSubscriber = {
    findUnique: async () => ({
      id: "sub-unsub",
      email: "returning@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: new Date("2026-01-01"),
      unsubscribedAt: new Date("2026-06-01"),
    }),
    update: async ({ where, data }) => {
      assert.equal(where.id, "sub-unsub");
      updatedData = data;
      return { id: "sub-unsub", ...data };
    },
  };

  const result = await subscribeNewsletterService({
    email: "returning@example.com",
    consent: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
  assert.ok(updatedData);
  assert.equal(updatedData.status, "ACTIVE");
  assert.equal(updatedData.unsubscribedAt, null);
  assert.ok(updatedData.subscribedAt instanceof Date);
});

test("9. Newsletter Service: Handles Prisma P2002 unique constraint race conditions safely", async () => {
  prisma.newsletterSubscriber = {
    findUnique: async () => null,
    create: async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        { code: "P2002", clientVersion: "6.19.3" }
      );
      throw error;
    },
  };

  const result = await subscribeNewsletterService({
    email: "race@example.com",
    consent: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
});

test("10. Newsletter Service: Generic response does not reveal whether email was already subscribed", async () => {
  // Case A: New email
  prisma.newsletterSubscriber = {
    findUnique: async () => null,
    create: async ({ data }) => ({ id: "1", ...data }),
  };
  const resNew = await subscribeNewsletterService({ email: "new@example.com", consent: true });

  // Case B: Existing active email
  prisma.newsletterSubscriber = {
    findUnique: async () => ({ id: "2", email: "existing@example.com", status: "ACTIVE" }),
  };
  const resExisting = await subscribeNewsletterService({ email: "existing@example.com", consent: true });

  // Case C: Existing unsubscribed email
  prisma.newsletterSubscriber = {
    findUnique: async () => ({ id: "3", email: "unsub@example.com", status: "UNSUBSCRIBED" }),
    update: async ({ data }) => ({ id: "3", ...data }),
  };
  const resUnsub = await subscribeNewsletterService({ email: "unsub@example.com", consent: true });

  assert.equal(resNew.message, resExisting.message);
  assert.equal(resNew.message, resUnsub.message);
  assert.equal(resNew.success, true);
  assert.equal(resExisting.success, true);
  assert.equal(resUnsub.success, true);
});

// ==========================================
// 3. Security: Origin Validation & Rate Limiting
// ==========================================

test("11. Origin Validation: Validates origin and host matching to block CSRF", () => {
  // Valid match
  const validReq = {
    headers: new Map([
      ["host", "ielung.com"],
      ["origin", "https://ielung.com"],
    ]),
  };
  assert.equal(
    isValidOrigin({ headers: { get: (k) => validReq.headers.get(k) } }),
    true
  );

  // Mismatched origin (CSRF attempt)
  const maliciousReq = {
    headers: new Map([
      ["host", "ielung.com"],
      ["origin", "https://malicious-phishing-site.com"],
    ]),
  };
  assert.equal(
    isValidOrigin({ headers: { get: (k) => maliciousReq.headers.get(k) } }),
    false
  );

  // Valid referer fallback
  const refererReq = {
    headers: new Map([
      ["host", "ielung.com"],
      ["referer", "https://ielung.com/blog"],
    ]),
  };
  assert.equal(
    isValidOrigin({ headers: { get: (k) => refererReq.headers.get(k) } }),
    true
  );
});

test("12. Rate Limiting: Blocks IP after exceeding MAX_ATTEMPTS threshold", () => {
  resetNewsletterRateLimit();
  const testIp = "192.168.1.100";

  // 1 through 5 attempts allowed
  for (let i = 0; i < 5; i++) {
    const check = checkNewsletterRateLimit(testIp);
    assert.equal(check.allowed, true);
  }

  // 6th attempt blocked
  const blockedCheck = checkNewsletterRateLimit(testIp);
  assert.equal(blockedCheck.allowed, false);
  assert.ok(blockedCheck.retryAfterSeconds && blockedCheck.retryAfterSeconds > 0);

  // Different IP still allowed
  assert.equal(checkNewsletterRateLimit("192.168.1.101").allowed, true);

  resetNewsletterRateLimit();
});

// ==========================================
// 4. API Route Handler End-to-End
// ==========================================

test("13. API Route POST: Returns 403 when origin check fails", async () => {
  const req = {
    headers: new Map([
      ["host", "ielung.com"],
      ["origin", "https://attacker.com"],
    ]),
    json: async () => ({ email: "patient@example.com", consent: true }),
  };

  const response = await POST({
    headers: { get: (k) => req.headers.get(k) },
    json: req.json,
  });

  assert.equal(response.status, 403);
  const data = await response.json();
  assert.equal(data.success, false);
  assert.equal(data.error, "Invalid request origin.");
});

test("14. API Route POST: Returns 400 when validation fails", async () => {
  resetNewsletterRateLimit();

  const req = {
    headers: new Map([
      ["host", "ielung.com"],
      ["origin", "https://ielung.com"],
    ]),
    json: async () => ({ email: "bad-email", consent: true }),
  };

  const response = await POST({
    headers: { get: (k) => req.headers.get(k) },
    json: req.json,
  });

  assert.equal(response.status, 400);
  const data = await response.json();
  assert.equal(data.success, false);
  assert.match(data.error, /valid email/i);
});

test("15. API Route POST: Returns 200 with generic success message on valid subscription", async () => {
  resetNewsletterRateLimit();

  prisma.newsletterSubscriber = {
    findUnique: async () => null,
    create: async ({ data }) => ({ id: "new-sub", ...data }),
  };

  const req = {
    headers: new Map([
      ["host", "ielung.com"],
      ["origin", "https://ielung.com"],
    ]),
    json: async () => ({ email: "valid.patient@example.com", consent: true }),
  };

  const response = await POST({
    headers: { get: (k) => req.headers.get(k) },
    json: req.json,
  });

  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.success, true);
  assert.equal(data.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
});
