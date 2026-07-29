import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { contactDetails } from "@/mocks/data/content";

/** Contact block in the footer, sourced from the same data as `/contact-us`. */
export default function FooterContact() {
  const telHref = (value: string) => `tel:${value.replace(/[^0-9+]/g, "")}`;

  return (
    <div className="text-ink-100">
      <h3 className="font-display text-xl mb-6 text-white">Contact us</h3>
      <ul className="space-y-4">
        <li className="flex items-start">
          <MapPin className="w-5 h-5 mr-4 mt-1 shrink-0 text-rust-300" />
          <address className="text-ink-200 not-italic">{contactDetails.address}</address>
        </li>
        <li className="flex items-start">
          <Mail className="w-5 h-5 mr-4 mt-1 shrink-0 text-rust-300" />
          <a
            href={`mailto:${contactDetails.email}`}
            className="text-ink-200 hover:text-white transition-colors"
          >
            {contactDetails.email}
          </a>
        </li>
        <li className="flex items-start">
          <Phone className="w-5 h-5 mr-4 mt-1 shrink-0 text-rust-300" />
          <a
            href={telHref(contactDetails.phone)}
            className="text-ink-200 hover:text-white transition-colors"
          >
            {contactDetails.phone}
          </a>
        </li>
        <li className="flex items-start">
          <Printer className="w-5 h-5 mr-4 mt-1 shrink-0 text-rust-300" />
          <span className="text-ink-200">{contactDetails.fax}</span>
        </li>
      </ul>
    </div>
  );
}
