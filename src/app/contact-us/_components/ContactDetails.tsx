import { MapPin, Mail, Phone, Printer } from "lucide-react";
import type { ContactDetailsBlock } from "@/types";

export interface ContactDetailsProps {
  contactDetails: ContactDetailsBlock | null;
}

const DEFAULT_DATA: ContactDetailsBlock = {
  title: "CONTACT DETAIL",
  address: "222-UTC , Americans",
  email: "Support@emtheme.com",
  phone: "(00)-213 1234567",
  fax: "(00)-213 1879017",
  aboutTitle: "ABOUT US",
  aboutText:
    "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam mauris egestas quam.",
};

/**
 * ContactDetails Component
 * Displays contact information and about us section
 */
export default function ContactDetails({ contactDetails }: ContactDetailsProps) {
  const contactData = contactDetails || DEFAULT_DATA;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      <div>
        <h3 className="text-2xl font-normal text-muted uppercase tracking-widest mb-8">
          {contactData.title}
        </h3>
        <ul className="space-y-6">
          <li className="flex items-start">
            <MapPin className="w-5 h-5 text-muted mr-4 mt-1 shrink-0" />
            <address className="text-muted not-italic">
              {contactData.address}
            </address>
          </li>
          <li className="flex items-start">
            <Mail className="w-5 h-5 text-muted mr-4 mt-1 shrink-0" />
            <a
              href={`mailto:${contactData.email}`}
              className="text-muted hover:text-ink transition-colors"
            >
              {contactData.email}
            </a>
          </li>
          <li className="flex items-start">
            <Phone className="w-5 h-5 text-muted mr-4 mt-1 shrink-0" />
            <a
              href={`tel:${contactData.phone.replace(/[^0-9+]/g, "")}`}
              className="text-muted hover:text-ink transition-colors"
            >
              {contactData.phone}
            </a>
          </li>
          <li className="flex items-start">
            <Printer className="w-5 h-5 text-muted mr-4 mt-1 shrink-0" />
            <a
              href={`tel:${contactData.fax.replace(/[^0-9+]/g, "")}`}
              className="text-muted hover:text-ink transition-colors"
            >
              {contactData.fax}
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-2xl font-normal text-muted uppercase tracking-widest mb-8">
          {contactData.aboutTitle}
        </h3>
        <p className="text-muted leading-7 whitespace-pre-line">
          {contactData.aboutText}
        </p>
      </div>
    </div>
  );
}
