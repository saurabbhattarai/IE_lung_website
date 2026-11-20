import test from "node:test";
import assert from "node:assert/strict";
import { SignJWT } from "jose";

// Setup base test environment variables
process.env.ADMIN_EMAIL = "admin@ielung.com";
process.env.ADMIN_PASSWORD = "StrongAdminPassword2026!";
process.env.JWT_SECRET = "super-secret-jwt-key-with-at-least-32-characters-length";

import {
  timingSafeEqualStrings,
  verifyPassword,
  verifyAdminCredentials,
} from "../lib/auth/password.ts";
import {
  getJwtSecretKey,
  signAdminToken,
  verifyAdminToken,
} from "../lib/auth/jwt.ts";
import {
  getAdminCredentials,
  requireAdminSession,
  getAdminSession,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from "../lib/auth/session.ts";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE,
  JWT_ISSUER,
  JWT_AUDIENCE,
  JWT_ALGORITHM,
} from "../lib/auth/constants.ts";
import {
  createBlogPostAction,
  getBlogPostByIdAction,
  getBlogPostsListAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  publishBlogPostAction,
  unpublishBlogPostAction,
} from "../lib/actions/blog.action.ts";

// ==========================================
// 1. Timing-Safe String Comparison
// ==========================================

test("1. Timing-Safe String Comparison: Accurately compares equal strings and handles mismatches safely", () => {
  // Identical strings match
  assert.equal(timingSafeEqualStrings("password123", "password123"), true);
  assert.equal(timingSafeEqualStrings("", ""), true);

  // Different contents fail
  assert.equal(timingSafeEqualStrings("password123", "password124"), false);

  // Different lengths fail without throwing RangeError
  assert.equal(timingSafeEqualStrings("short", "much-longer-string"), false);
  assert.equal(timingSafeEqualStrings("a", "ab"), false);

  // Non-string inputs fail safely
  assert.equal(timingSafeEqualStrings(null, "test"), false);
  assert.equal(timingSafeEqualStrings(undefined, "test"), false);
  assert.equal(timingSafeEqualStrings(12345, "12345"), false);
});

// ==========================================
// 2. Password Verification
// ==========================================

test("2. Password Verification: Compares password directly against ADMIN_PASSWORD or passed target", async () => {
  // Valid match against process.env.ADMIN_PASSWORD
  assert.equal(
    await verifyPassword("StrongAdminPassword2026!"),
    true
  );

  // Valid match against explicit target password
  assert.equal(
    await verifyPassword("CustomPassword99", "CustomPassword99"),
    true
  );

  // Rejects incorrect password
  assert.equal(
    await verifyPassword("WrongPassword!"),
    false
  );
  assert.equal(
    await verifyPassword("StrongAdminPassword2026!", "DifferentTarget"),
    false
  );

  // Rejects empty or invalid inputs
  assert.equal(await verifyPassword(""), false);
  assert.equal(await verifyPassword(null), false);
  assert.equal(await verifyPassword(undefined), false);

  // Rejects when target configuration is absent
  const origEnv = process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_PASSWORD;
  assert.equal(await verifyPassword("StrongAdminPassword2026!"), false);
  process.env.ADMIN_PASSWORD = origEnv;
});

// ==========================================
// 3. Admin Credentials Verification (Email + Password)
// ==========================================

test("3. Admin Credentials Verification: Requires both correct email and password", async () => {
  // Exact match
  assert.equal(
    await verifyAdminCredentials("admin@ielung.com", "StrongAdminPassword2026!"),
    true
  );

  // Case-insensitive email normalization
  assert.equal(
    await verifyAdminCredentials("ADMIN@ielung.com", "StrongAdminPassword2026!"),
    true
  );
  assert.equal(
    await verifyAdminCredentials("  admin@ielung.com  ", "StrongAdminPassword2026!"),
    true
  );

  // Incorrect email
  assert.equal(
    await verifyAdminCredentials("wrong@ielung.com", "StrongAdminPassword2026!"),
    false
  );

  // Incorrect password
  assert.equal(
    await verifyAdminCredentials("admin@ielung.com", "IncorrectPassword"),
    false
  );

  // Missing email or password in request
  assert.equal(await verifyAdminCredentials("", "StrongAdminPassword2026!"), false);
  assert.equal(await verifyAdminCredentials("admin@ielung.com", ""), false);
});

test("4. Missing Environment Configuration: verifyAdminCredentials fails safely if ADMIN_EMAIL or ADMIN_PASSWORD is unset", async () => {
  const origEmail = process.env.ADMIN_EMAIL;
  const origPass = process.env.ADMIN_PASSWORD;

  // Missing ADMIN_EMAIL
  delete process.env.ADMIN_EMAIL;
  assert.equal(
    await verifyAdminCredentials("admin@ielung.com", "StrongAdminPassword2026!"),
    false
  );

  // Restore email, delete ADMIN_PASSWORD
  process.env.ADMIN_EMAIL = origEmail;
  delete process.env.ADMIN_PASSWORD;
  assert.equal(
    await verifyAdminCredentials("admin@ielung.com", "StrongAdminPassword2026!"),
    false
  );

  // Restore both
  process.env.ADMIN_PASSWORD = origPass;
});

test("5. getAdminCredentials: Throws critical error when either ADMIN_EMAIL or ADMIN_PASSWORD is missing", () => {
  const origEmail = process.env.ADMIN_EMAIL;
  const origPass = process.env.ADMIN_PASSWORD;

  // When both configured
  const creds = getAdminCredentials();
  assert.equal(creds.email, "admin@ielung.com");
  assert.equal(creds.password, "StrongAdminPassword2026!");

  // Missing ADMIN_EMAIL
  delete process.env.ADMIN_EMAIL;
  assert.throws(
    () => getAdminCredentials(),
    /CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD environment variable is not configured/
  );

  // Missing ADMIN_PASSWORD
  process.env.ADMIN_EMAIL = origEmail;
  delete process.env.ADMIN_PASSWORD;
  assert.throws(
    () => getAdminCredentials(),
    /CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD environment variable is not configured/
  );

  // Restore
  process.env.ADMIN_PASSWORD = origPass;
});

// ==========================================
// 4. JWT Creation and Verification Lifecycle
// ==========================================

test("6. JWT Creation: signAdminToken produces a valid HS256 JWT with strict claims", async () => {
  const token = await signAdminToken("admin@ielung.com");
  assert.ok(typeof token === "string" && token.length > 50);

  // Successfully verifies with correct claims
  const payload = await verifyAdminToken(token);
  assert.ok(payload);
  assert.equal(payload.email, "admin@ielung.com");
  assert.equal(payload.role, "admin");
  assert.equal(payload.iss, JWT_ISSUER);
  assert.equal(payload.aud, JWT_AUDIENCE);
  assert.ok(payload.exp > Math.floor(Date.now() / 1000));
});

test("7. JWT Verification: Rejects tampered, expired, or invalid tokens", async () => {
  const validToken = await signAdminToken("admin@ielung.com");

  // Tampered payload
  const tamperedToken = validToken.slice(0, -6) + "xxxxxx";
  assert.equal(await verifyAdminToken(tamperedToken), null);

  // Empty or non-string token
  assert.equal(await verifyAdminToken(""), null);
  assert.equal(await verifyAdminToken(null), null);

  // Expired token
  const secret = getJwtSecretKey();
  const expiredToken = await new SignJWT({ email: "admin@ielung.com", role: "admin" })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt(Math.floor(Date.now() / 1000) - 100)
    .setExpirationTime(Math.floor(Date.now() / 1000) - 10) // Expired 10 seconds ago
    .sign(secret);

  assert.equal(await verifyAdminToken(expiredToken), null);

  // Invalid issuer
  const wrongIssuerToken = await new SignJWT({ email: "admin@ielung.com", role: "admin" })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setIssuer("malicious-issuer")
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  assert.equal(await verifyAdminToken(wrongIssuerToken), null);

  // Invalid audience
  const wrongAudienceToken = await new SignJWT({ email: "admin@ielung.com", role: "admin" })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setIssuer(JWT_ISSUER)
    .setAudience("malicious-audience")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  assert.equal(await verifyAdminToken(wrongAudienceToken), null);

  // Token signed with different secret
  const differentSecret = new TextEncoder().encode("different-secret-key-at-least-32-chars-long!");
  const foreignToken = await new SignJWT({ email: "admin@ielung.com", role: "admin" })
    .setProtectedHeader({ alg: JWT_ALGORITHM, typ: "JWT" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(differentSecret);

  assert.equal(await verifyAdminToken(foreignToken), null);
});

test("8. JWT Secret Security: Enforces minimum key length of 32 bytes (256 bits)", () => {
  const origSecret = process.env.JWT_SECRET;

  // Missing secret
  delete process.env.JWT_SECRET;
  assert.throws(
    () => getJwtSecretKey(),
    /CRITICAL: JWT_SECRET environment variable is missing/
  );

  // Short secret (< 32 characters)
  process.env.JWT_SECRET = "too-short-secret";
  assert.throws(
    () => getJwtSecretKey(),
    /CRITICAL: JWT_SECRET is too short/
  );

  // Restore
  process.env.JWT_SECRET = origSecret;
});

// ==========================================
// 5. Cookie Security Settings
// ==========================================

test("9. Cookie Security: setAdminSessionCookie configures HttpOnly, SameSite, and maxAge", () => {
  const mockCookies = [];
  const mockResponse = {
    cookies: {
      set: (opts) => mockCookies.push(opts),
    },
  };

  setAdminSessionCookie(mockResponse, "test-token-123");

  assert.equal(mockCookies.length, 1);
  const cookie = mockCookies[0];
  assert.equal(cookie.name, ADMIN_COOKIE_NAME);
  assert.equal(cookie.value, "test-token-123");
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.sameSite, "lax");
  assert.equal(cookie.path, "/");
  assert.equal(cookie.maxAge, ADMIN_COOKIE_MAX_AGE);
});

test("10. Cookie Removal: clearAdminSessionCookie resets maxAge to 0 with matching security flags", () => {
  const mockCookies = [];
  const mockResponse = {
    cookies: {
      set: (opts) => mockCookies.push(opts),
    },
  };

  clearAdminSessionCookie(mockResponse);

  assert.equal(mockCookies.length, 1);
  const cookie = mockCookies[0];
  assert.equal(cookie.name, ADMIN_COOKIE_NAME);
  assert.equal(cookie.value, "");
  assert.equal(cookie.httpOnly, true);
  assert.equal(cookie.maxAge, 0);
});

// ==========================================
// 6. Login Rate Limiting Simulation
// ==========================================

test("11. Rate Limiting: Blocks IP after 5 consecutive failed attempts and resets upon success", () => {
  const loginAttempts = new Map();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000;

  function checkRateLimit(ip) {
    const entry = loginAttempts.get(ip);
    if (!entry) return { allowed: true };
    if (Date.now() > entry.resetAt) {
      loginAttempts.delete(ip);
      return { allowed: true };
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - Date.now()) / 1000) };
    }
    return { allowed: true };
  }

  function recordFailed(ip) {
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (!entry || now > entry.resetAt) {
      loginAttempts.set(ip, { attempts: 1, resetAt: now + WINDOW_MS });
    } else {
      entry.attempts += 1;
    }
  }

  function resetRate(ip) {
    loginAttempts.delete(ip);
  }

  const testIp = "192.168.1.100";

  // First 5 failed attempts allowed
  for (let i = 1; i <= 5; i++) {
    assert.equal(checkRateLimit(testIp).allowed, true);
    recordFailed(testIp);
  }

  // 6th attempt is blocked with 429
  const blockedCheck = checkRateLimit(testIp);
  assert.equal(blockedCheck.allowed, false);
  assert.ok(blockedCheck.retryAfterSeconds > 0);

  // Successful login clears counter
  resetRate(testIp);
  assert.equal(checkRateLimit(testIp).allowed, true);
});

// ==========================================
// 7. Protected Route Authorization Checks
// ==========================================

test("12. Route Authorization: requireAdminSession rejects unauthenticated access", async () => {
  // Without active cookie, requireAdminSession rejects with error
  await assert.rejects(
    async () => await requireAdminSession(),
    /UNAUTHORIZED: A valid admin session is required/
  );
});

test("13. Server Actions Defense: Privileged blog actions reject unauthenticated calls", async () => {
  // createBlogPostAction rejects
  const createRes = await createBlogPostAction({
    title: "Unauth Post",
    excerpt: "Excerpt",
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "t" }] }] },
  });
  assert.equal(createRes.success, false);
  assert.match(createRes.error, /UNAUTHORIZED/i);

  // getBlogPostByIdAction rejects
  const getRes = await getBlogPostByIdAction("any-id");
  assert.equal(getRes.success, false);
  assert.match(getRes.error, /UNAUTHORIZED/i);

  // getBlogPostsListAction rejects
  const listRes = await getBlogPostsListAction();
  assert.equal(listRes.success, false);
  assert.match(listRes.error, /UNAUTHORIZED/i);

  // updateBlogPostAction rejects
  const updateRes = await updateBlogPostAction("any-id", { title: "New" });
  assert.equal(updateRes.success, false);
  assert.match(updateRes.error, /UNAUTHORIZED/i);

  // publishBlogPostAction rejects
  const pubRes = await publishBlogPostAction("any-id");
  assert.equal(pubRes.success, false);
  assert.match(pubRes.error, /UNAUTHORIZED/i);

  // unpublishBlogPostAction rejects
  const unpubRes = await unpublishBlogPostAction("any-id");
  assert.equal(unpubRes.success, false);
  assert.match(unpubRes.error, /UNAUTHORIZED/i);

  // deleteBlogPostAction rejects
  const delRes = await deleteBlogPostAction("any-id");
  assert.equal(delRes.success, false);
  assert.match(delRes.error, /UNAUTHORIZED/i);
});
