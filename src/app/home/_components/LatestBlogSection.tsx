import type { LatestBlogData } from "@/mocks";
import LatestBlogCard from "./LatestBlogCard";

export interface LatestBlogSectionProps {
  data: LatestBlogData;
}

export default function LatestBlogSection({ data }: LatestBlogSectionProps) {
  if (data.posts.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
            {data.title}
          </h2>
          {data.description ? (
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
              {data.description}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {data.posts.map((post) => (
            <LatestBlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
