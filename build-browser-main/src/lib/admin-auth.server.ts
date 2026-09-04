import { createHmac, timingSafeEqual } from "node:crypto";

// Server-only. Password + signed session-token handling for the admin
// terminal. Never imported from client code — the `.server.ts` suffix
// guarantees that.

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET");
  return secret;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = String(exp);
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  if (!safeEqual(sig, expectedSig)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function buildSessionCookie(token: string, requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === "https:" ? "; Secure" : "";
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function buildClearSessionCookie(requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === "https:" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`;
}

export function isAuthorized(request: Request): boolean {
  const cookies = parseCookies(request.headers.get("cookie"));
  return verifySessionToken(cookies[ADMIN_SESSION_COOKIE]);
}
