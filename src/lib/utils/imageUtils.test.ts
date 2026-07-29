import { resolveImageUrl, pickImageUrl, FALLBACK_IMAGE, getProductThumbUrl } from "./imageUtils";

describe("resolveImageUrl", () => {
  it("returns the trimmed source when it is a non-empty string", () => {
    expect(resolveImageUrl("  /images/shoe.jpg  ")).toBe("/images/shoe.jpg");
  });

  it("falls back for null, undefined, and empty/whitespace strings", () => {
    expect(resolveImageUrl(null)).toBe(FALLBACK_IMAGE);
    expect(resolveImageUrl(undefined)).toBe(FALLBACK_IMAGE);
    expect(resolveImageUrl("")).toBe(FALLBACK_IMAGE);
    expect(resolveImageUrl("   ")).toBe(FALLBACK_IMAGE);
  });
});

describe("pickImageUrl", () => {
  it("prefers the requested size from imageUrls", () => {
    const source = { imageUrls: { thumb: "thumb.jpg", medium: "medium.jpg", full: "full.jpg" } };
    expect(pickImageUrl(source, "medium")).toBe("medium.jpg");
  });

  it("degrades to imageUrls.full when the requested size is missing", () => {
    const source = { imageUrls: { full: "full.jpg" } };
    expect(pickImageUrl(source as never, "thumb")).toBe("full.jpg");
  });

  it("degrades to the plain `image` field when imageUrls is absent", () => {
    expect(pickImageUrl({ image: "flat.jpg" })).toBe("flat.jpg");
  });

  it("degrades to `url` when neither imageUrls nor image is present", () => {
    expect(pickImageUrl({ url: "legacy.jpg" })).toBe("legacy.jpg");
  });

  it("returns the fallback for a null/undefined source", () => {
    expect(pickImageUrl(null)).toBe(FALLBACK_IMAGE);
    expect(pickImageUrl(undefined)).toBe(FALLBACK_IMAGE);
  });

  it("returns the fallback when every candidate is blank", () => {
    expect(pickImageUrl({ image: "", url: "  " })).toBe(FALLBACK_IMAGE);
  });

  it("getProductThumbUrl is a thin wrapper that requests the thumb size", () => {
    const source = { imageUrls: { thumb: "t.jpg", medium: "m.jpg", full: "f.jpg" } };
    expect(getProductThumbUrl(source)).toBe("t.jpg");
  });
});
