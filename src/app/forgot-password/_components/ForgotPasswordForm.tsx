"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/mocks";
import useToastStore from "@/store/toastStore";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { forgotPasswordSchema } from "@/lib/authSchemas";

export default function ForgotPasswordForm() {
  const lang = useLanguageClient();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = forgotPasswordSchema.safeParse({ email: email.trim() });
    if (!parsed.success) {
      toastError(t(lang, "errors.emailRequired") || "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.forgotPassword(parsed.data.email);
      setSent(true);
      toastSuccess(t(lang, "forgotPassword.successMessage"));
    } catch (err) {
      const msg = apiErrorMessage(err);
      toastError(typeof msg === "string" ? msg : t(lang, "something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-positive-soft">
          <svg className="h-7 w-7 text-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-ink">
          {t(lang, "forgotPassword.successMessage")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Check your email for the reset link.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <span className="eyebrow">Account recovery</span>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {t(lang, "forgotPassword.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            {t(lang, "login.email")}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            disabled={isLoading}
            className="mt-1.5 block w-full border border-line-strong bg-surface rounded-md py-2.5 px-3.5 text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus:border-brand disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-md font-medium text-brand-fg bg-brand hover:bg-brand-hover transition-colors focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t(lang, "forgotPassword.submit")
          )}
        </button>
      </form>
    </>
  );
}
