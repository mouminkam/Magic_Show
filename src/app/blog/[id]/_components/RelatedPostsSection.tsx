import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { resolveImageUrl } from "@/lib/utils/imageUtils";

export interface RelatedPostsSectionProps {
  posts: BlogPost[];
}

/** Same-category articles, shown below the article body and comments. */
export default function RelatedPostsSection({ posts }: RelatedPostsSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line bg-sunken py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="eyebrow">Keep reading</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-normal uppercase tracking-wide text-ink">
            Related posts
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="animate-in-up group">
              <Link href={`/blog/${post.id}`} className="block">
                <div className="relative h-56 w-full overflow-hidden rounded-lg">
                  <Image
                    src={resolveImageUrl(post.image)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <span className="eyebrow mt-4 block">{post.category}</span>
                <h3 className="mt-2 text-lg font-medium text-ink group-hover:text-muted transition-colors">
                  {post.title}
                </h3>
                <time dateTime={post.publishedAt} className="mt-2 block text-sm text-faint tnum">
                  {post.date}
                </time>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
