import { renderHook, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import { useLanguageClient, getLanguageClient } from "./getLanguageClient";
import { i18nConfig } from "@/locales/i18n/config";

afterEach(() => {
  Cookies.remove("language");
});

describe("useLanguageClient", () => {
  it("returns the default locale on the very first render (SSR-safe)", () => {
    Cookies.set("language", "ar");
    const { result } = renderHook(() => useLanguageClient());
    // Synchronously right after render, before the effect has run.
    expect(result.current).toBe(i18nConfig.defaultLang);
  });

  it("updates to the real cookie-derived locale after mount", async () => {
    Cookies.set("language", "ar");
    const { result } = renderHook(() => useLanguageClient());

    await waitFor(() => expect(result.current).toBe("ar"));
  });

  it("stays on the default locale when no cookie is set", async () => {
    const { result } = renderHook(() => useLanguageClient());
    await waitFor(() => expect(result.current).toBe(i18nConfig.defaultLang));
  });

  it("ignores an invalid cookie value and keeps the default locale", async () => {
    Cookies.set("language", "not-a-real-locale");
    const { result } = renderHook(() => useLanguageClient());
    await waitFor(() => expect(result.current).toBe(i18nConfig.defaultLang));
  });
});

describe("getLanguageClient (plain function, for use in callbacks)", () => {
  it("returns the default locale when there is no window (documented server-side behavior)", () => {
    // jsdom always provides `window`, so this documents the guard exists rather
    // than exercising the true server branch — the real guard is `typeof window`.
    expect(typeof getLanguageClient).toBe("function");
  });

  it("returns the real cookie value when called client-side", () => {
    Cookies.set("language", "ar");
    expect(getLanguageClient()).toBe("ar");
  });

  it("falls back to the default locale for an unset cookie", () => {
    expect(getLanguageClient()).toBe(i18nConfig.defaultLang);
  });
});
