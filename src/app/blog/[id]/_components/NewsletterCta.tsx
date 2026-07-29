import { api } from "@/mocks";
import Newsletter from "@/app/home/_components/Newsletter";

/** Reuses the site-wide newsletter capture, same as the bottom of the home page. */
export default async function NewsletterCta() {
  const { enabled, data } = await api.content.getNewsletter();
  if (!enabled) return null;

  return <Newsletter header={data} />;
}
