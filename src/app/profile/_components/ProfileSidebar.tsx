"use client";

import { User, Mail, Phone, Pencil, LogOut } from "lucide-react";
import type { Customer } from "@/types";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";

export interface ProfileSidebarProps {
  user: Customer | null;
  onEdit: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export default function ProfileSidebar({ user, onEdit, onLogout, isLoading }: ProfileSidebarProps) {
  const lang = useLanguageClient();

  if (!user) return null;

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "User";

  return (
    <div className="bg-surface rounded-lg shadow-[var(--shadow-sm)] border border-line p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-brand" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-ink truncate">{displayName}</h2>
          <p className="text-sm text-muted truncate">{user.email || "—"}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-faint mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(lang, "profile.email")}</p>
            <p className="text-sm font-medium text-ink truncate">{user.email || "—"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-faint mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(lang, "profile.phone")}</p>
            <p className="text-sm font-medium text-ink truncate">{user.phone || "—"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onEdit}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-sm hover:bg-brand-soft disabled:opacity-60"
        >
          <Pencil className="w-4 h-4" />
          {t(lang, "profile.edit")}
        </button>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-critical border border-critical/30 rounded-sm hover:bg-critical-soft disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" />
          {t(lang, "profile.logout")}
        </button>
      </div>
    </div>
  );
}
