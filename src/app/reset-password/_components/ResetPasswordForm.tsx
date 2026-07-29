"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { api } from "@/mocks";
import useToastStore from "@/store/toastStore";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { resetPasswordSchema } from "@/lib/authSchemas";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLanguageClient();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !email) {
      toastError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toastError(first?.message ?? t(lang, "something_went_wrong"));
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.resetPassword({
        token,
        email,
        password: parsed.data.password,
        passwordConfirmation: parsed.data.confirmPassword,
      });
      toastSuccess("Password reset successfully!");
      router.push("/login?reset=success");
    } catch (err) {
      const msg = apiErrorMessage(err);
      toastError(typeof msg === "string" ? msg : t(lang, "something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-critical-soft">
          <svg className="h-7 w-7 text-critical" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-ink">Invalid Reset Link</h2>
        <p className="mt-2 text-sm text-muted">
          This link is invalid or expired. Please request a new password reset.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-brand hover:text-brand-hover font-medium focus-visible:ring-2 focus-visible:ring-brand-ring rounded outline-none"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const inputClass =
    "mt-1.5 block w-full border border-line-strong bg-surface rounded-md py-2.5 px-3.5 text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus:border-brand disabled:opacity-60";

  return (
    <>
      <div className="text-center">
        <span className="eyebrow">Set a new password</span>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {t(lang, "resetPassword.title")}
        </h2>
      </div>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            {t(lang, "resetPassword.newPassword")}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            disabled={isLoading}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
            {t(lang, "resetPassword.confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className={inputClass}
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
            t(lang, "resetPassword.submit")
          )}
        </button>
      </form>
    </>
  );
}
