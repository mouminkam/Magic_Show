import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@/types";
import { api } from "@/mocks";
import { getLanguage } from "@/lib/getLanguage";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import BlogDetailSection from "./_components/BlogDetailSection";
import BlogDetailStream from "./_components/BlogDetailStream";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

/** Pre-renders every article at build time. */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const { data } = await api.blog.listPosts({ limit: 100 });
  return data.items.map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: post } = await api.blog.getPost(id);
    return {
      title: `${post.title} · Magic Show Blog`,
      description: post.excerpt,
      keywords: [post.category, ...post.tags],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        images: [{ url: post.image }],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const [lang, { id }] = await Promise.all([getLanguage(), params]);

  let post;
  try {
    ({ data: post } = await api.blog.getPost(id));
  } catch (error) {
    // A missing post is a 404, not a 500 — anything else should surface.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const commentsPromise = api.blog.getComments(post.id);
  const relatedPromise = api.blog.getRelated(post.id);

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <BlogDetailSection post={post} lang={lang} />

        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <BlogDetailStream
            post={post}
            lang={lang}
            commentsPromise={commentsPromise}
            relatedPromise={relatedPromise}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
