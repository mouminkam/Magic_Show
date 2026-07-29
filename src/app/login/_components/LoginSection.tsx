"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { api } from "@/mocks";
import useAuthStore from "@/store/authStore";
import useToastStore from "@/store/toastStore";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { normalizeLoginIdentifier } from "@/lib/phone";
import { loginSchema } from "@/lib/authSchemas";

interface CountryOption {
  code: CountryCode;
  dial: string;
  name: string;
}

export default function LoginSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLanguageClient();
  const login = useAuthStore((s) => s.login);
  const { error: toastError } = useToastStore();

  const [identifier, setIdentifier] = useState("");
  const [country, setCountry] = useState<CountryCode>("SY");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const countryOptions = useMemo<CountryOption[]>(() => {
    const locale = lang === "ar" ? "ar" : "en";
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });

    const options = getCountries().map((code) => {
      const dial = `+${getCountryCallingCode(code)}`;
      const name = displayNames.of(code) || code;
      return { code, dial, name };
    });

    options.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    // Keep Syria at the top for faster access (default is already SY)
    const syIndex = options.findIndex((o) => o.code === "SY");
    if (syIndex > 0) {
      const [sy] = options.splice(syIndex, 1);
      options.unshift(sy);
    }

    return options;
  }, [lang]);

  const localHint = country === "SY" ? "09XXXXXXXX" : "XXXXXXXX";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = normalizeLoginIdentifier(identifier, country);
    const parsed = loginSchema.safeParse({ identifier: normalized, password });
    if (!parsed.success) {
      toastError(t(lang, "errors.emailRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.login(parsed.data);
      const { customer, accessToken } = response.data;

      login(customer, accessToken);

      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      const message = apiErrorMessage(err);
      toastError(typeof message === "string" ? message : t(lang, "errors.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 block w-full border border-line-strong bg-surface rounded-md py-2.5 px-3.5 text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus:border-brand disabled:opacity-60";

  return (
    <div className="w-full lg:w-2/3 mx-auto bg-surface rounded-xl shadow-[var(--shadow-md)] border border-line px-4 sm:px-10 py-10 sm:py-12 animate-in-up">
      <div className="w-full text-center">
        <span className="eyebrow">Welcome back</span>
        <h2 className="mt-2 text-3xl font-semibold text-ink">
          {t(lang, "login.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Sign in to continue your Magic Show experience
        </p>
      </div>

      <div className="mt-8 w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-ink">
              {t(lang, "login.country")}
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setCountry(e.target.value as CountryCode)
              }
              disabled={isLoading}
              className={inputClass}
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              {t(lang, "login.identifier")}
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              required
              placeholder={
                t(lang, "login.identifier_placeholder") +
                " (" +
                localHint +
                ")"
              }
              value={identifier}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              {t(lang, "login.password")}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={isLoading}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              href="/forgot-password"
              className="text-sm text-brand hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand-ring rounded outline-none"
            >
              {t(lang, "login.forgotPassword")}
            </Link>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-2 rounded-md text-base font-medium text-brand-fg bg-brand hover:bg-brand-hover transition-colors focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t(lang, "login.submit")
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted">
              {t(lang, "login.noAccount")}{" "}
              <Link href="/register" className="font-medium text-brand hover:text-brand-hover">
                {t(lang, "login.register")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
