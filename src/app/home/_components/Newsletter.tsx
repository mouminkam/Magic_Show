"use client";

import { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import type { NewsletterSectionData } from "@/mocks";
import { api } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import useToastStore from "@/store/toastStore";

export interface NewsletterProps {
  header: NewsletterSectionData;
}

/** Email capture form. Validation happens in the mock newsletter service. */
export default function Newsletter({ header }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toastSuccess = useToastStore((state) => state.success);
  const toastError = useToastStore((state) => state.error);
  const lang = useLanguageClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toastError(t(lang, "email_required"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.newsletter.subscribe(email);
      setIsSuccess(true);
      setEmail("");
      toastSuccess(data.message);
    } catch (error) {
      toastError(apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ink-900 flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {header.title}
          </h2>
          {header.description && (
            <p className="text-muted text-base md:text-lg mb-8">{header.description}</p>
          )}

          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                {t(lang, "email")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setIsSuccess(false);
                }}
                placeholder={t(lang, "email_placeholder")}
                className="w-full px-4 py-3 border border-line-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent text-ink placeholder-faint"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-8 py-3 bg-ink-900 text-white font-semibold rounded-lg hover:bg-ink-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  {t(lang, "subscribed")}
                </>
              ) : isSubmitting ? (
                t(lang, "subscribing")
              ) : (
                t(lang, "subscribe")
              )}
            </button>
          </form>

          <p className="text-xs text-muted mt-4">
            {t(lang, "newsletter_privacy")}
          </p>
        </div>
      </div>
    </section>
  );
}
