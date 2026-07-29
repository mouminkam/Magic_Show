export interface ContactMapProps {
  mapUrl?: string | null;
}

const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d13597.136035303396!2d74.35585675451732!3d31.571258754489254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m5!1s0x39191ab43100bd61%3A0x6fca2c2899c49c9d!2sMughalpura%2C+Lahore%2C+Pakistan!3m2!1d31.5711904!2d74.3646122!4m0!5e0!3m2!1sen!2s!4v1459623932322";

/**
 * ContactMap Component
 * Displays Google Maps embed
 */
export default function ContactMap({ mapUrl }: ContactMapProps) {
  return (
    <div className="w-full">
      <iframe
        src={mapUrl || DEFAULT_MAP_URL}
        width="100%"
        height="800"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
