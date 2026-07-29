import type { ApiResponse } from "@/types";
import type { ContactPageData } from "@/mocks";
import ContactSection from "./ContactSection";

export interface ContactUsStreamProps {
  contactPagePromise: Promise<ApiResponse<ContactPageData>>;
}

export default async function ContactUsStream({
  contactPagePromise,
}: ContactUsStreamProps) {
  const { data } = await contactPagePromise;

  return (
    <ContactSection
      contactHero={data.hero}
      mapUrl={data.mapUrl}
      contactDetails={data.details}
    />
  );
}
