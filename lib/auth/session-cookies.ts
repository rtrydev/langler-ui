import "client-only";

import type { AuthSession } from "./cognito";

const ACCESS_COOKIE = "langler_access";
const ID_COOKIE = "langler_id";
const REFRESH_COOKIE = "langler_refresh";

const ACCESS_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Strict${secure}`;
}

function readCookie(name: string) {
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : "";
}

export function writeSessionCookies(session: AuthSession) {
  writeCookie(ACCESS_COOKIE, session.accessToken, ACCESS_MAX_AGE_SECONDS);
  writeCookie(ID_COOKIE, session.idToken, ACCESS_MAX_AGE_SECONDS);
  writeCookie(REFRESH_COOKIE, session.refreshToken, REFRESH_MAX_AGE_SECONDS);
}

export function readSessionCookies(): AuthSession | null {
  const refreshToken = readCookie(REFRESH_COOKIE);
  if (!refreshToken) {
    return null;
  }
  return {
    accessToken: readCookie(ACCESS_COOKIE),
    idToken: readCookie(ID_COOKIE),
    refreshToken,
  };
}

export function clearSessionCookies() {
  for (const name of [ACCESS_COOKIE, ID_COOKIE, REFRESH_COOKIE]) {
    writeCookie(name, "", 0);
  }
}
