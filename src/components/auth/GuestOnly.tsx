"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export interface GuestOnlyProps {
  children: ReactNode;
  redirectTo?: string;
}

/** Renders `children` only for signed-out visitors; redirects everyone else. */
export default function GuestOnly({ children, redirectTo = "/" }: GuestOnlyProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) router.replace(redirectTo);
  }, [hydrated, isAuthenticated, router, redirectTo]);

  if (!hydrated || isAuthenticated) return null;

  return <>{children}</>;
}
