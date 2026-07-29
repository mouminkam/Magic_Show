import { getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

function toCountryCode(value: string): CountryCode | null {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  return normalized as CountryCode;
}

export function normalizeE164FromLocal(input: string, country: string): string {
  const value = input.trim();
  if (!value) return value;

  if (value.startsWith("+")) {
    return value.replace(/\s+/g, "");
  }

  const digits = value.replace(/\D/g, "");
  if (!digits) return value;

  let dial = "+963";
  const cc = toCountryCode(country);
  if (cc) {
    try {
      dial = `+${getCountryCallingCode(cc)}`;
    } catch {
      // keep default
    }
  }

  if (digits.startsWith("0")) {
    return `${dial}${digits.slice(1)}`;
  }

  return `${dial}${digits}`;
}

export function normalizeLoginIdentifier(input: string, country: string): string {
  const value = input.trim();
  if (!value) return value;

  if (value.includes("@")) return value;

  return normalizeE164FromLocal(value, country);
}
