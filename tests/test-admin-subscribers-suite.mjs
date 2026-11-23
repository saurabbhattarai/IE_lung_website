import test from "node:test";
import assert from "node:assert/strict";

// Configure test environment variables before module imports
process.env.ADMIN_EMAIL = "admin@ielung.com";
process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";
process.env.JWT_SECRET = "super-secret-jwt-key-that-is-at-least-32-chars-long";
process.env.DATABASE_URL = "mysql://user:pass@localhost:3306/test";

import { prisma } from "../lib/prisma.ts";
import {
  SubscriberQuerySchema,
  UnsubscribeSubscriberSchema,
} from "../lib/validations/subscriber.validation.ts";
import {
  getSubscribersListService,
  unsubscribeSubscriberService,
  getSubscriberExportDataService,
  getSubscriberStatsService,
} from "../lib/subscriber/service.ts";
import {
  sanitizeCsvField,
  generateSubscribersCsv,
  formatCsvDate,
} from "../lib/subscriber/csv.ts";
import {
  getSubscribersListAction,
  unsubscribeSubscriberAction,
  getSubscriberStatsAction,
} from "../lib/actions/subscriber.action.ts";
import { GET as exportRoute } from "../app/api/admin/subscribers/export/route.ts";
import {
  subscribeNewsletterService,
  GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE,
} from "../lib/newsletter/service.ts";
import { NextRequest } from "next/server";

// ==========================================
// 1. Admin Authentication Enforcement
// ==========================================

test("1. Admin Auth Enforcement: Server actions and export route reject unauthenticated calls", async () => {
  const listRes = await getSubscribersListAction();
  assert.equal(listRes.success, false);
  assert.match(listRes.error, /unauthorized|authentication|session/i);

  const unsubRes = await unsubscribeSubscriberAction("test-id");
  assert.equal(unsubRes.success, false);
  assert.match(unsubRes.error, /unauthorized|authentication|session/i);

  const statsRes = await getSubscriberStatsAction();
  assert.equal(statsRes.success, false);
  assert.match(statsRes.error, /unauthorized|authentication|session/i);

  // Export route returns 401 when unauthenticated
  const req = new NextRequest("http://localhost:3000/api/admin/subscribers/export");
  const exportRes = await exportRoute(req);
  assert.equal(exportRes.status, 401);
  const exportBody = await exportRes.json();
  assert.equal(exportBody.success, false);
});

// ==========================================
// 2. Listing and Pagination
// ==========================================

test("2. Listing & Pagination: Computes correct skip, take, and pagination metadata", async () => {
  let capturedQuery = null;

  prisma.newsletterSubscriber = {
    findMany: async (args) => {
      capturedQuery = args;
      return [
        {
          id: "sub-1",
          email: "patient1@example.com",
          status: "ACTIVE",
          subscribedAt: new Date("2026-10-01"),
          unsubscribedAt: null,
          createdAt: new Date("2026-10-01"),
          updatedAt: new Date("2026-10-01"),
        },
      ];
    },
    count: async () => 45,
  };

  const result = await getSubscribersListService({ page: 2, limit: 20 });

  assert.equal(capturedQuery.skip, 20);
  assert.equal(capturedQuery.take, 20);
  assert.deepEqual(capturedQuery.orderBy, [
    { subscribedAt: "desc" },
    { createdAt: "desc" },
  ]);
  assert.equal(result.total, 45);
  assert.equal(result.page, 2);
  assert.equal(result.limit, 20);
  assert.equal(result.totalPages, 3); // 45 / 20 = ceil(2.25) = 3
  assert.equal(result.subscribers.length, 1);
});

// ==========================================
// 3. Email Search Filtering
// ==========================================

test("3. Search Filter: Correctly filters database query by email contains", async () => {
  let capturedWhere = null;

  prisma.newsletterSubscriber = {
    findMany: async (args) => {
      capturedWhere = args.where;
      return [];
    },
    count: async ({ where }) => 0,
  };

  await getSubscribersListService({ search: "  smith@clinic  " });

  assert.ok(capturedWhere);
  assert.deepEqual(capturedWhere.email, { contains: "smith@clinic" });
});

// ==========================================
// 4. Status Filtering
// ==========================================

test("4. Status Filter: Correctly applies ACTIVE, UNSUBSCRIBED, and ALL filters", async () => {
  let capturedWhere = null;

  prisma.newsletterSubscriber = {
    findMany: async (args) => {
      capturedWhere = args.where;
      return [];
    },
    count: async () => 0,
  };

  // Active filter
  await getSubscribersListService({ status: "ACTIVE" });
  assert.equal(capturedWhere.status, "ACTIVE");

  // Unsubscribed filter
  await getSubscribersListService({ status: "UNSUBSCRIBED" });
  assert.equal(capturedWhere.status, "UNSUBSCRIBED");

  // ALL filter
  await getSubscribersListService({ status: "ALL" });
  assert.equal(capturedWhere.status, undefined);
});

// ==========================================
// 5. Empty Results Handling
// ==========================================

test("5. Empty Results: Returns empty list with totalPages = 1 when no records match", async () => {
  prisma.newsletterSubscriber = {
    findMany: async () => [],
    count: async () => 0,
  };

  const result = await getSubscribersListService({
    search: "nonexistent@example.com",
    status: "ACTIVE",
  });

  assert.equal(result.subscribers.length, 0);
  assert.equal(result.total, 0);
  assert.equal(result.totalPages, 1);
});

// ==========================================
// 6. Atomic Unsubscribe Success
// ==========================================

test("6. Atomic Unsubscribe: Uses updateMany with conditional status ACTIVE to transition safely", async () => {
  const originalSubscribedAt = new Date("2026-05-10T12:00:00Z");
  const originalCreatedAt = new Date("2026-05-10T12:00:00Z");

  let updateManyWhere = null;
  let updateManyData = null;

  prisma.newsletterSubscriber = {
    updateMany: async ({ where, data }) => {
      updateManyWhere = where;
      updateManyData = data;
      return { count: 1 };
    },
    findUniqueOrThrow: async ({ where }) => ({
      id: where.id,
      email: "active@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: originalSubscribedAt,
      unsubscribedAt: updateManyData.unsubscribedAt,
      createdAt: originalCreatedAt,
      updatedAt: new Date(),
    }),
  };

  const updated = await unsubscribeSubscriberService("sub-to-unsub");

  // Confirm atomic condition was enforced
  assert.deepEqual(updateManyWhere, {
    id: "sub-to-unsub",
    status: "ACTIVE",
  });
  assert.equal(updated.status, "UNSUBSCRIBED");
  assert.ok(updateManyData.unsubscribedAt instanceof Date);
});

// ==========================================
// 7. Repeated Unsubscribe Safe Handling
// ==========================================

test("7. Repeated Unsubscribe: Safely rejects attempt to unsubscribe already UNSUBSCRIBED subscriber", async () => {
  prisma.newsletterSubscriber = {
    updateMany: async () => ({ count: 0 }), // 0 records updated because status is already UNSUBSCRIBED
    findUnique: async () => ({
      id: "sub-already-unsub",
      status: "UNSUBSCRIBED",
    }),
  };

  await assert.rejects(
    async () => {
      await unsubscribeSubscriberService("sub-already-unsub");
    },
    {
      message: "This subscriber is already unsubscribed.",
    }
  );
});

// ==========================================
// 8. Invalid Subscriber IDs
// ==========================================

test("8. Invalid Subscriber IDs: Safely throws error for missing or nonexistent IDs", async () => {
  prisma.newsletterSubscriber = {
    updateMany: async () => ({ count: 0 }),
    findUnique: async () => null,
  };

  // Non-existent ID
  await assert.rejects(
    async () => {
      await unsubscribeSubscriberService("non-existent-id");
    },
    {
      message: "Subscriber record not found.",
    }
  );

  // Empty string
  await assert.rejects(
    async () => {
      await unsubscribeSubscriberService("");
    },
    {
      message: "A valid subscriber ID is required.",
    }
  );

  // Validation schema check
  const schemaRes = UnsubscribeSubscriberSchema.safeParse({ id: "" });
  assert.equal(schemaRes.success, false);
});

// ==========================================
// 9. Preservation of subscribedAt & History
// ==========================================

test("9. Data Integrity: Preserves subscribedAt and createdAt untouched during unsubscribe", async () => {
  const originalSubscribedAt = new Date("2026-03-15T08:30:00Z");
  const originalCreatedAt = new Date("2026-03-15T08:30:00Z");

  let updatePayload = null;

  prisma.newsletterSubscriber = {
    updateMany: async ({ data }) => {
      updatePayload = data;
      return { count: 1 };
    },
    findUniqueOrThrow: async () => ({
      id: "preserve-sub",
      email: "preserve@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: originalSubscribedAt,
      unsubscribedAt: updatePayload.unsubscribedAt,
      createdAt: originalCreatedAt,
      updatedAt: new Date(),
    }),
  };

  const result = await unsubscribeSubscriberService("preserve-sub");

  // Verify only status and unsubscribedAt were altered in update data
  assert.equal(updatePayload.subscribedAt, undefined);
  assert.equal(updatePayload.createdAt, undefined);
  assert.equal(result.subscribedAt.getTime(), originalSubscribedAt.getTime());
  assert.equal(result.createdAt.getTime(), originalCreatedAt.getTime());
});

// ==========================================
// 10. CSV Headers & Data Generation
// ==========================================

test("10. CSV Export: Generates RFC-compliant UTF-8 CSV with expected column headers and ISO dates", () => {
  const records = [
    {
      email: "patient@example.com",
      status: "ACTIVE",
      subscribedAt: new Date("2026-10-01T10:00:00Z"),
      unsubscribedAt: null,
      createdAt: new Date("2026-10-01T10:00:00Z"),
      updatedAt: new Date("2026-10-01T10:00:00Z"),
    },
    {
      email: "former@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: new Date("2026-01-01T00:00:00Z"),
      unsubscribedAt: new Date("2026-06-01T12:00:00Z"),
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-06-01T12:00:00Z"),
    },
  ];

  const csv = generateSubscribersCsv(records);

  // Starts with UTF-8 BOM
  assert.ok(csv.startsWith("\uFEFF"));

  // Check header line
  assert.ok(
    csv.includes(
      "Email,Status,SubscribedAt,UnsubscribedAt,CreatedAt,UpdatedAt"
    )
  );

  // Check data rows
  assert.ok(csv.includes("patient@example.com,ACTIVE,2026-10-01T10:00:00.000Z,,2026-10-01T10:00:00.000Z,2026-10-01T10:00:00.000Z"));
  assert.ok(csv.includes("former@example.com,UNSUBSCRIBED,2026-01-01T00:00:00.000Z,2026-06-01T12:00:00.000Z,2026-01-01T00:00:00.000Z,2026-06-01T12:00:00.000Z"));
});

// ==========================================
// 11. CSV Delimiter and Quote Escaping
// ==========================================

test("11. CSV Escaping: Properly quotes and escapes fields containing commas, quotes, and newlines", () => {
  // Comma
  assert.equal(sanitizeCsvField("test,comma"), '"test,comma"');

  // Quotes
  assert.equal(sanitizeCsvField('test"quote'), '"test""quote"');

  // Newline
  assert.equal(sanitizeCsvField("line1\nline2"), '"line1\nline2"');

  // Carriage return
  assert.equal(sanitizeCsvField("line1\rline2"), '"line1\rline2"');

  // Multiple special characters
  assert.equal(sanitizeCsvField('hello, "world"\nnew'), '"hello, ""world""\nnew"');
});

// ==========================================
// 12. Formula Injection Protection (CSV Injection)
// ==========================================

test("12. Formula Injection Defense: Handles =, +, -, @, leading spaces, tabs, and carriage returns safely", () => {
  // Standard formula triggers
  assert.equal(sanitizeCsvField("=SUM(A1:A10)"), "'=SUM(A1:A10)");
  assert.equal(sanitizeCsvField("+12345"), "'+12345");
  assert.equal(sanitizeCsvField("-cmd|' /C calc'!A0"), "'-cmd|' /C calc'!A0");
  assert.equal(sanitizeCsvField("@SUM(1,2)"), '"\'@SUM(1,2)"'); // contains comma, so quoted
  assert.equal(sanitizeCsvField("\tTabPrefixed"), "'\tTabPrefixed");
  assert.equal(sanitizeCsvField("\rCarriageReturn"), "\"'\\rCarriageReturn\"".replace("\\r", "\r"));

  // Leading spaces followed by formula characters
  assert.equal(sanitizeCsvField(" =SUM(A1)"), "' =SUM(A1)");
  assert.equal(sanitizeCsvField("   +1234"), "'   +1234");
  assert.equal(sanitizeCsvField("  -cmd"), "'  -cmd");
  assert.equal(sanitizeCsvField("   @admin"), "'   @admin");

  // Legitimate numbers and ISO dates are preserved without formula prefixing
  assert.equal(sanitizeCsvField(-42), "-42");
  assert.equal(sanitizeCsvField("-42"), "-42");
  assert.equal(sanitizeCsvField("-123.45"), "-123.45");
  assert.equal(sanitizeCsvField(3.14), "3.14");
  assert.equal(sanitizeCsvField("2026-11-22T15:00:00.000Z"), "2026-11-22T15:00:00.000Z");

  // Malicious email payload
  const maliciousEmail = "=cmd|' /C calc'!A0@example.com";
  const sanitized = sanitizeCsvField(maliciousEmail);
  assert.ok(sanitized.startsWith("'="));
});

// ==========================================
// 13. Export Filtering Across All Pages
// ==========================================

test("13. Full Export: getSubscriberExportDataService queries all matching records without pagination limit", async () => {
  let capturedQuery = null;

  prisma.newsletterSubscriber = {
    findMany: async (args) => {
      capturedQuery = args;
      return [
        {
          id: "1",
          email: "match1@example.com",
          status: "ACTIVE",
          subscribedAt: new Date(),
          unsubscribedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          email: "match2@example.com",
          status: "ACTIVE",
          subscribedAt: new Date(),
          unsubscribedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    },
  };

  const records = await getSubscriberExportDataService({
    search: "match",
    status: "ACTIVE",
  });

  assert.equal(capturedQuery.skip, undefined, "Export must not paginate skip");
  assert.equal(capturedQuery.take, undefined, "Export must not paginate take");
  assert.deepEqual(capturedQuery.where, {
    status: "ACTIVE",
    email: { contains: "match" },
  });
  assert.equal(records.length, 2);
});

// ==========================================
// 14. Dashboard Statistics Aggregation
// ==========================================

test("14. Dashboard Stats: getSubscriberStatsService aggregates total, active, and unsubscribed counts", async () => {
  let countCalls = 0;

  prisma.newsletterSubscriber = {
    count: async (args) => {
      countCalls++;
      if (!args || !args.where) return 100; // total
      if (args.where.status === "ACTIVE") return 85;
      if (args.where.status === "UNSUBSCRIBED") return 15;
      return 0;
    },
  };

  const stats = await getSubscriberStatsService();

  assert.equal(stats.total, 100);
  assert.equal(stats.active, 85);
  assert.equal(stats.unsubscribed, 15);
  assert.equal(countCalls, 3, "Executes exactly three parallel count queries");
});

// ==========================================
// 15. Public Subscriber Endpoint Remains Unaffected
// ==========================================

test("15. Regression Guard: Public newsletter subscription functionality remains intact and secure", async () => {
  let createdData = null;

  prisma.newsletterSubscriber = {
    findUnique: async () => null,
    create: async ({ data }) => {
      createdData = data;
      return { id: "new-public-sub", ...data };
    },
  };

  const result = await subscribeNewsletterService({
    email: "PublicPatient@IElung.com",
    consent: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.message, GENERIC_SUBSCRIPTION_SUCCESS_MESSAGE);
  assert.ok(createdData);
  assert.equal(createdData.email, "publicpatient@ielung.com");
  assert.equal(createdData.status, "ACTIVE");
  assert.equal(createdData.unsubscribedAt, null);
});

// ==========================================
// 16. Concurrency Simulation: Concurrent Unsubscribe Race Condition
// ==========================================

test("16. Concurrency Race Defense: Second concurrent request sees count = 0 and does not overwrite timestamps", async () => {
  const originalUnsubscribedAt = new Date("2026-11-22T20:00:00Z");
  let executionCount = 0;

  // Simulate two concurrent requests arriving at the database:
  // First request (executionCount = 1) succeeds atomically.
  // Second request (executionCount = 2) matches 0 active rows.
  prisma.newsletterSubscriber = {
    updateMany: async () => {
      executionCount++;
      if (executionCount === 1) {
        return { count: 1 };
      }
      return { count: 0 }; // second concurrent request
    },
    findUniqueOrThrow: async () => ({
      id: "race-sub",
      email: "race@example.com",
      status: "UNSUBSCRIBED",
      subscribedAt: new Date("2026-01-01"),
      unsubscribedAt: originalUnsubscribedAt,
      createdAt: new Date("2026-01-01"),
      updatedAt: originalUnsubscribedAt,
    }),
    findUnique: async () => ({
      id: "race-sub",
      status: "UNSUBSCRIBED",
    }),
  };

  // Request 1: Succeeds
  const res1 = await unsubscribeSubscriberService("race-sub");
  assert.equal(res1.status, "UNSUBSCRIBED");

  // Request 2: Concurrent/re-entrant attempt fails cleanly without re-updating
  await assert.rejects(
    async () => {
      await unsubscribeSubscriberService("race-sub");
    },
    {
      message: "This subscriber is already unsubscribed.",
    }
  );
});
