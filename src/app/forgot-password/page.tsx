"use client";

import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-sunken py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex flex-col justify-center min-h-[calc(100vh-5rem)]">
          <div className="w-full lg:w-2/3 mx-auto bg-surface rounded-xl shadow-[var(--shadow-md)] border border-line px-4 sm:px-10 py-10 sm:py-12 animate-in-up">
            <ForgotPasswordForm />
            <p className="mt-6 text-center text-sm text-muted">
              <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
