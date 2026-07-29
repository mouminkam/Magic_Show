"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { Customer } from "@/types";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";

export interface ProfileFormValues {
  first_name: string;
  last_name: string;
  phone: string;
}

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Customer | null;
  initialValues: ProfileFormValues | null;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  user,
  initialValues,
  onSubmit,
  isLoading,
}: ProfileEditModalProps) {
  const lang = useLanguageClient();

  const safeInitial = useMemo<ProfileFormValues>(
    () => ({
      first_name: initialValues?.first_name ?? user?.firstName ?? "",
      last_name: initialValues?.last_name ?? user?.lastName ?? "",
      phone: initialValues?.phone ?? user?.phone ?? "",
    }),
    [initialValues, user]
  );

  const [values, setValues] = useState<ProfileFormValues>(safeInitial);

  useEffect(() => {
    if (isOpen) {
      setValues(safeInitial);
    }
  }, [isOpen, safeInitial]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit?.(values);
    } catch {
      // The caller (ProfileSection) already surfaces a toast on failure.
    }
  };

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (isLoading ? null : onClose?.())}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-surface rounded-lg shadow-xl border border-line">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h3 className="text-lg font-bold text-ink">{t(lang, "profile.edit")}</h3>
            <button
              type="button"
              onClick={() => (isLoading ? null : onClose?.())}
              className="p-1 rounded hover:bg-sunken focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">
                  {t(lang, "profile.firstName")}
                </label>
                <input
                  name="first_name"
                  type="text"
                  value={values.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mt-1 block w-full border border-line-strong rounded-sm shadow-[var(--shadow-sm)] py-2 px-3 focus:outline-none focus:border-brand disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink">
                  {t(lang, "profile.lastName")}
                </label>
                <input
                  name="last_name"
                  type="text"
                  value={values.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mt-1 block w-full border border-line-strong rounded-sm shadow-[var(--shadow-sm)] py-2 px-3 focus:outline-none focus:border-brand disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">
                {t(lang, "profile.email")}
              </label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="mt-1 block w-full border border-line-strong rounded-sm shadow-[var(--shadow-sm)] py-2 px-3 bg-sunken text-muted"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">
                {t(lang, "profile.phone")}
              </label>
              <input
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 block w-full border border-line-strong rounded-sm shadow-[var(--shadow-sm)] py-2 px-3 focus:outline-none focus:border-brand disabled:opacity-60"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => (isLoading ? null : onClose?.())}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-muted border border-line-strong rounded-sm hover:bg-sunken disabled:opacity-60"
              >
                {t(lang, "profile.cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-sm hover:bg-brand-hover disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t(lang, "profile.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
