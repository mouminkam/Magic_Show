import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import type { BlogPost, Locale } from "@/types";
import { t } from "@/locales/i18n/getTranslation";
import { resolveImageUrl } from "@/lib/utils/imageUtils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ShareLinks from "./ShareLinks";

export interface BlogDetailSectionProps {
  post: BlogPost;
  lang: Locale;
}

/** Above-the-fold hero and article body — rendered immediately, no streaming. */
export default function BlogDetailSection({ post, lang }: BlogDetailSectionProps) {
  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <article className="pb-4">
      {/* Hero */}
      <div className="relative h-80 md:h-[28rem] lg:h-[32rem] w-full">
        <Image
          src={resolveImageUrl(post.image)}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="container mx-auto px-4 pb-10 lg:pb-14">
            <AnimatedSection>
              <span className="eyebrow inline-block rounded-full bg-white/10 px-3 py-1 text-white backdrop-blur-sm">
                {post.category}
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl md:text-4xl lg:text-5xl font-normal uppercase tracking-wide text-white">
                {post.title}
              </h1>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Meta bar */}
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>
                <span className="text-faint">By</span>{" "}
                <span className="font-medium text-ink">{post.author}</span>
              </span>
              <time dateTime={post.publishedAt} className="tnum">
                {post.date}
              </time>
              <span>{post.readingMinutes} min read</span>
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>

            <ShareLinks title={post.title} lang={lang} />
          </div>
        </AnimatedSection>

        {/* Body */}
        <AnimatedSection>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none py-10 lg:py-12 prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-wide prose-a:text-ink"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </AnimatedSection>

        {/* Tags + back link */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="eyebrow rounded-full border border-line px-3 py-1 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/blog"
            className="text-sm font-medium uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            ← {t(lang, "back_to_blog")}
          </Link>
        </div>
      </div>
    </article>
  );
}
