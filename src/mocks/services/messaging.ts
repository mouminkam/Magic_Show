import type { ApiResponse, ContactMessageInput } from "@/types";
import { fail, respond } from "../runtime";

/** Outbound forms: newsletter sign-up and the contact-us message. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const newsletterService = {
  async subscribe(email: string): Promise<ApiResponse<{ message: string }>> {
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      return fail("Enter a valid email address.", 422, "VALIDATION_FAILED", {
        email: ["Enter a valid email address."],
      });
    }
    return respond({ message: "You are on the list. Check your inbox to confirm." });
  },

  async unsubscribe(email: string): Promise<ApiResponse<{ message: string }>> {
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      return fail("Enter a valid email address.", 422, "VALIDATION_FAILED");
    }
    return respond({ message: "You have been unsubscribed." });
  },
};

export const contactService = {
  async sendMessage(input: ContactMessageInput): Promise<ApiResponse<{ message: string }>> {
    const errors: Record<string, string[]> = {};

    if (!input.firstName.trim()) errors.first_name = ["Tell us your first name."];
    if (!input.lastName.trim()) errors.last_name = ["Tell us your last name."];
    if (!EMAIL_PATTERN.test(input.email.trim())) {
      errors.email = ["Enter a valid email address."];
    }
    if (!input.subject.trim()) errors.subject = ["Add a subject."];
    if (!input.message.trim()) errors.message = ["Write your message."];

    if (Object.keys(errors).length > 0) {
      return fail("Please check the highlighted fields.", 422, "VALIDATION_FAILED", errors);
    }

    return respond({
      message: "Message sent. We reply within one working day.",
    });
  },
};
