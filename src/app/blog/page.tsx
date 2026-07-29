import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import { api } from "@/mocks";
import type { BlogPost, PageBanner } from "@/types";

export const metadata: Metadata = {
  title: "Blog - Magic Show",
  description:
    "Read the latest fashion trends, styling tips and news from Magic Show. Discover inspiration for your wardrobe.",
  keywords: ["blog", "fashion", "trends", "styling tips", "fashion news", "wardrobe inspiration"],
  openGraph: {
    title: "Blog - Magic Show",
    description: "Read the latest fashion trends and styling tips",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const BlogSection = dynamic(() => import("./_components/BlogSection"), {
  loading: () => <SectionSkeleton variant="default" height="h-screen" />,
  ssr: true,
});

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getBlogBanner(): Promise<PageBanner> {
  try {
    const { data } = await api.blog.getBanner();
    return data;
  } catch (error) {
    console.error("Error fetching blog banner:", error);
    return {
      title: "BLOGS",
      subtitle: "",
      backgroundImage:
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1600&q=80&auto=format&fit=crop",
      leftBadge: null,
      rightBadge: null,
    };
  }
}

interface BlogPostsResult {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
}

async function getBlogPosts(page: number): Promise<BlogPostsResult> {
  try {
    const response = await api.blog.listPosts({ page });
    return {
      posts: response.data.items,
      currentPage: response.meta.pagination.currentPage,
      totalPages: response.meta.pagination.totalPages,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { posts: [], currentPage: page, totalPages: 1 };
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params?.page || "1", 10);

  const [blogData, blogBanner] = await Promise.all([
    getBlogPosts(currentPage),
    getBlogBanner(),
  ]);

  return (
    <div className="bg-surface min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <BlogSection
            blogPosts={blogData.posts}
            blogBanner={blogBanner}
            currentPage={blogData.currentPage}
            totalPages={blogData.totalPages}
            className="overflow-hidden"
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
