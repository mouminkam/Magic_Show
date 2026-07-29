"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { api } from "@/mocks";
import useToastStore from "@/store/toastStore";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { normalizeE164FromLocal } from "@/lib/phone";
import { registerSchema } from "@/lib/authSchemas";

interface CountryOption {
  code: CountryCode;
  dial: string;
  name: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterSection() {
  const router = useRouter();
  const lang = useLanguageClient();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [country, setCountry] = useState<CountryCode>("SY");

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

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedPhone = normalizeE164FromLocal(formData.phone, country);
    const parsed = registerSchema.safeParse({
      ...formData,
      phone: normalizedPhone,
    });
    if (!parsed.success) {
      toastError(t(lang, "something_went_wrong"));
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        firstName: parsed.data.firstName.trim(),
        lastName: parsed.data.lastName.trim(),
        email: parsed.data.email.trim(),
        phone: parsed.data.phone,
        password: parsed.data.password,
        passwordConfirmation: parsed.data.confirmPassword,
      };

      await api.auth.register(payload);
      toastSuccess(t(lang, "register.title") + " - " + "Success!");
      router.push("/login");
    } catch (err) {
      const message = apiErrorMessage(err);
      toastError(typeof message === "string" ? message : t(lang, "something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 block w-full border border-line-strong bg-surface rounded-md py-2.5 px-3.5 text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus:border-brand disabled:opacity-60";

  return (
    <div className="w-full lg:w-2/3 mx-auto bg-surface rounded-xl shadow-[var(--shadow-md)] border border-line px-4 sm:px-10 py-10 sm:py-12 animate-in-up">
      <div className="w-full text-center">
        <span className="eyebrow">Join us</span>
        <h2 className="mt-2 text-3xl font-semibold text-ink">
          {t(lang, "register.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Create an account and discover a world of magical wear
        </p>
      </div>

      <div className="mt-8 w-full">
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-ink">
                  {t(lang, "register.firstName")}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-ink">
                  {t(lang, "register.lastName")}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                {t(lang, "login.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-ink">
                {t(lang, "register.country")}
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
              <label htmlFor="phone" className="block text-sm font-medium text-ink">
                {t(lang, "register.phone")}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder={localHint}
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                {t(lang, "login.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={inputClass}
              />
              <p className="mt-2 text-sm text-muted">
                Use 8+ characters, upper/lower case, numbers, and symbols
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
                {t(lang, "resetPassword.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-2 rounded-md text-base font-medium text-brand-fg bg-brand hover:bg-brand-hover transition-colors focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t(lang, "register.submit")
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted">
                {t(lang, "register.haveAccount")}{" "}
                <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
                  {t(lang, "register.login")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
