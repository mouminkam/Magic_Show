import type { ApiResponse, BlogComment, BlogPost, Locale } from "@/types";
import SectionBoundary from "@/components/ui/SectionBoundary";
import CommentsSection from "./CommentsSection";
import RelatedPostsSection from "./RelatedPostsSection";
import NewsletterCta from "./NewsletterCta";

export interface BlogDetailStreamProps {
  post: BlogPost;
  lang: Locale;
  commentsPromise: Promise<ApiResponse<BlogComment[]>>;
  relatedPromise: Promise<ApiResponse<BlogPost[]>>;
}

/**
 * Awaits comments and related posts separately from the hero/article body so
 * the main content paints before these below-the-fold queries resolve.
 */
export default async function BlogDetailStream({
  post,
  lang,
  commentsPromise,
  relatedPromise,
}: BlogDetailStreamProps) {
  const [{ data: comments }, { data: related }] = await Promise.all([
    commentsPromise,
    relatedPromise,
  ]);

  return (
    <>
      <SectionBoundary>
        <CommentsSection post={post} initialComments={comments} lang={lang} />
      </SectionBoundary>

      <SectionBoundary>
        <RelatedPostsSection posts={related} />
      </SectionBoundary>

      <SectionBoundary>
        <NewsletterCta />
      </SectionBoundary>
    </>
  );
}
