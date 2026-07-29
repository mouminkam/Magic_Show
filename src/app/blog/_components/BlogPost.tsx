import Image from "next/image";
import Link from "next/link";
import type { BlogPost as BlogPostData } from "@/types";
import { resolveImageUrl } from "../../../lib/utils/imageUtils";

export interface BlogPostProps {
  /** Blog post data */
  post: BlogPostData;
  /** Index of the post in the list */
  index: number;
}

/**
 * BlogPost Component
 * Displays a single blog post with image, title, excerpt, and link
 */
export default function BlogPost({ post, index }: BlogPostProps) {
  const isLeftSide = index % 2 === 0;

  const resolvedImageSrc = resolveImageUrl(post.image);

  return (
    <article className="post-blog mb-20">
      <div
        className={`holder flex flex-col ${
          isLeftSide ? "lg:flex-row" : "lg:flex-row-reverse"
        } items-center lg:items-stretch`}
      >
        {/* Image Holder */}
        <div
          className={`img-holder w-full lg:w-2/5 mb-8 lg:mb-0 relative z-1  ${
            isLeftSide ? "lg:mr-12" : "lg:ml-12"
          }`}
        >
          <Link href={`/blog/${post.id}`}>
            <div className="relative h-100 lg:h-120">
              <Image
                src={resolvedImageSrc}
                alt={post.title}
                fill
                className="object-cover h-full w-full rounded"
              />
            </div>
          </Link>
        </div>

        {/* Text Content */}
        <div
          className={`text-wrap w-full lg:w-3/5 relative p-5 max-lg:right-0 z-0 ${
            isLeftSide
              ? "lg:-bottom-20 lg:-left-10"
              : "lg:-right-10 lg:-bottom-20 lg:left-20"
          }`}
        >
          {/* Border Effect */}
          <div
            className={`absolute inset-0 border-2 border-orange-400 ${
              isLeftSide
                ? "lg:-left-30 -top-4 lg:right-4 bottom-5 max-lg:mr-3 max-lg:ml-0"
                : "lg:-left-5 -top-5 lg:-right-30 bottom-5 max-lg:ml-3 max-lg:mr-0"
            }`}
          ></div>

          <div className="relative z-10 mb-5 p-6 lg:p-8">
            {/* Blog Heading */}
            <h2 className="text-3xl font-normal text-ink uppercase tracking-widest mb-10 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-50 after:h-1 after:bg-ink-600">
              <Link href={`/blog/${post.id}`} className="text-muted">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p className="text-muted text-lg leading-9 mb-10">
              {post.excerpt}
            </p>

            {/* Continue Reading Button */}
            <Link
              href={`/blog/${post.id}`}
              className="btn-more inline-flex items-center text-muted uppercase font-semibold tracking-wider"
            >
              Continue
              <span className="icon-right-arrow ml-3">→</span>
            </Link>
          </div>

          {/* Date - Desktop */}
          <time
            className={`time hidden lg:block max-lg:hidden absolute top-1/2 transform text-3xl -translate-y-1/2 uppercase text-muted tracking-wider ${
              isLeftSide
                ? "right-0 translate-x-full rotate-90 origin-center lg:right-25"
                : "left-0 -translate-x-full -rotate-90 origin-center lg:left-15"
            }`}
            dateTime={post.date}
          >
            {post.date}
          </time>
        </div>
      </div>
    </article>
  );
}
