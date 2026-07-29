"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "@/components/Button";
import { api } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";

export interface ContactFormProps {
  /** Company email from contact details (for display only) */
  companyEmail?: string;
}

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/**
 * ContactForm Component
 * Submits contact form to the mock content API
 */
export default function ContactForm({ companyEmail = "" }: ContactFormProps) {
  void companyEmail;
  const [formData, setFormData] = useState<ContactFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.contact.sendMessage({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        setSuccess(true);
        setFormData(EMPTY_FORM);
      }
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-normal text-muted uppercase tracking-widest mb-8">
        LEAVE A MESSAGE
      </h3>

      {success && (
        <div className="mb-6 p-4 bg-positive-soft border border-positive/30 text-positive rounded-lg text-sm">
          Message sent successfully. We will get back to you soon.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-critical-soft border border-critical/30 text-critical rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First name"
              className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300"
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last name"
              className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300"
            required
            disabled={loading}
          />
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone (optional)"
            className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300"
            disabled={loading}
          />
        </div>

        <div>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Subject"
            className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300"
            required
            disabled={loading}
          />
        </div>

        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your message"
            rows={4}
            className="w-full px-0 py-3 border-0 border-b border-line-strong bg-transparent text-ink placeholder-faint focus:outline-none focus:border-brand transition-colors duration-300 resize-none"
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" variant="secondary" size="md" disabled={loading}>
            {loading ? "Sending..." : "send message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
