import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * HMAC-signed anonymous session tokens. The free flow has no login; a signed
 * cookie ties a browser to its cases without any account.
 */

const COOKIE_NAME = "ma_anon";

function secret(): string {
  const s = process.env.APP_SECRET;
  if (!s) throw new Error("APP_SECRET is not set — see .env.example");
  return s;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAnonToken(): string {
  const id = randomBytes(16).toString("base64url");
  return `${id}.${sign(id)}`;
}

export function verifyAnonToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [id, sig] = token.split(".");
  if (!id || !sig) return null;
  const expected = sign(id);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return token;
}

export const anonCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  },
};
