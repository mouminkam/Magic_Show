import { normalizeE164FromLocal, normalizeLoginIdentifier } from "./phone";

describe("normalizeE164FromLocal", () => {
  it("leaves an already-E.164 number untouched apart from stripping spaces", () => {
    expect(normalizeE164FromLocal("+963 11 331 8820", "SY")).toBe("+963113318820");
  });

  it("converts a local number with a leading 0 by dropping the 0 and prefixing the country's dial code", () => {
    expect(normalizeE164FromLocal("0113318820", "SY")).toBe("+963113318820");
  });

  it("prefixes a local number with no leading 0 the same way", () => {
    expect(normalizeE164FromLocal("113318820", "SY")).toBe("+963113318820");
  });

  it("strips non-digit characters (spaces, dashes) before prefixing", () => {
    expect(normalizeE164FromLocal("011-331-8820", "SY")).toBe("+963113318820");
  });

  it("falls back to +963 when given an invalid/unrecognized country code", () => {
    expect(normalizeE164FromLocal("0113318820", "XX")).toBe("+963113318820");
  });

  it("uses the correct dial code for a different valid country", () => {
    expect(normalizeE164FromLocal("0501234567", "AE")).toBe("+971501234567");
  });

  it("returns an empty string unchanged", () => {
    expect(normalizeE164FromLocal("", "SY")).toBe("");
  });

  it("returns whitespace-only input unchanged after trimming to empty", () => {
    expect(normalizeE164FromLocal("   ", "SY")).toBe("");
  });
});

describe("normalizeLoginIdentifier", () => {
  it("passes an email address through unchanged", () => {
    expect(normalizeLoginIdentifier("user@example.com", "SY")).toBe("user@example.com");
  });

  it("normalizes a phone-shaped identifier the same way normalizeE164FromLocal does", () => {
    expect(normalizeLoginIdentifier("0113318820", "SY")).toBe("+963113318820");
  });

  it("trims surrounding whitespace before checking for '@'", () => {
    expect(normalizeLoginIdentifier("  user@example.com  ", "SY")).toBe("user@example.com");
  });
});
