"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/mocks";
import type { UpdateProfilePayload } from "@/types";
import useAuthStore from "@/store/authStore";
import useToastStore from "@/store/toastStore";
import { useLanguageClient } from "@/lib/getLanguageClient";
import { t } from "@/locales/i18n/getTranslation";
import apiErrorMessage from "@/lib/apiErrorMessage";
import ProfileSidebar from "./ProfileSidebar";
import OrdersHistory from "./OrdersHistory";
import ProfileEditModal, { type ProfileFormValues } from "./ProfileEditModal";
import ProfileWishlist from "./ProfileWishlist";

export default function ProfileSection() {
  const lang = useLanguageClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [formData, setFormData] = useState<ProfileFormValues>({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.firstName ?? "",
        last_name: user.lastName ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleSubmit = async (nextValues: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const payload: UpdateProfilePayload = {
        firstName: nextValues?.first_name ?? formData.first_name,
        lastName: nextValues?.last_name ?? formData.last_name,
        phone: nextValues?.phone ?? formData.phone,
      };

      const { data: updatedUser } = await api.auth.updateProfile(payload);
      setUser(updatedUser);
      setFormData({
        first_name: updatedUser.firstName ?? payload.firstName ?? "",
        last_name: updatedUser.lastName ?? payload.lastName ?? "",
        phone: updatedUser.phone ?? payload.phone ?? "",
      });
      setIsEditOpen(false);
      toastSuccess(t(lang, "profile.save") + " - Success!");
    } catch (err) {
      const msg = apiErrorMessage(err);
      toastError(typeof msg === "string" ? msg : t(lang, "something_went_wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">{t(lang, "profile.title")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileSidebar
            user={user}
            onEdit={() => setIsEditOpen(true)}
            onLogout={handleLogout}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <OrdersHistory isAuthenticated={true} />
            <ProfileWishlist />
          </div>
        </div>
      </div>

      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
        initialValues={formData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
