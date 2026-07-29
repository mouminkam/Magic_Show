import type {
  ApiResponse,
  BlogComment,
  BlogCommentInput,
  BlogPost,
  PageBanner,
  PaginatedResponse,
} from "@/types";
import { blogComments, blogPostById, blogPosts } from "../data/blog";
import { blogBanner } from "../data/content";
import { fail, normalizePageRequest, respond, respondPaginated } from "../runtime";

const DEFAULT_PAGE_SIZE = 4;

export const blogService = {
  async getBanner(): Promise<ApiResponse<PageBanner>> {
    return respond(blogBanner);
  },

  async listPosts(request: { page?: number; limit?: number } = {}): Promise<
    PaginatedResponse<BlogPost>
  > {
    const { page, limit } = normalizePageRequest(request, DEFAULT_PAGE_SIZE);
    const sorted = [...blogPosts].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    );
    return respondPaginated(sorted, page, limit);
  },

  /** The three newest posts, for the home page carousel. */
  async listLatest(limit = 3): Promise<ApiResponse<BlogPost[]>> {
    const sorted = [...blogPosts]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, limit);
    return respond(sorted);
  },

  async getPost(id: number | string): Promise<ApiResponse<BlogPost>> {
    const post = blogPostById.get(Number(id));
    if (!post) {
      return fail(`Post ${id} was not found.`, 404, "POST_NOT_FOUND");
    }
    return respond(post);
  },

  async getComments(postId: number | string): Promise<ApiResponse<BlogComment[]>> {
    const id = Number(postId);
    return respond(
      blogComments.filter((comment) => comment.postId === id && comment.isApproved)
    );
  },

  /** Same-category posts first, then the newest of the rest, excluding `id` itself. */
  async getRelated(id: number | string, limit = 3): Promise<ApiResponse<BlogPost[]>> {
    const post = blogPostById.get(Number(id));
    if (!post) return respond<BlogPost[]>([]);

    const byDateDesc = (a: BlogPost, b: BlogPost) =>
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt);

    const sameCategory = blogPosts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .sort(byDateDesc);

    const alreadyPicked = new Set(sameCategory.map((p) => p.id));
    const filler = blogPosts
      .filter((p) => p.id !== post.id && !alreadyPicked.has(p.id))
      .sort(byDateDesc);

    return respond([...sameCategory, ...filler].slice(0, limit));
  },

  /**
   * Accepts a comment for moderation. Nothing is persisted — the UI reports
   * "awaiting approval", which is what the real endpoint does too.
   */
  async addComment(input: BlogCommentInput): Promise<ApiResponse<{ message: string }>> {
    const post = blogPostById.get(input.postId);
    if (!post) {
      return fail(`Post ${input.postId} was not found.`, 404, "POST_NOT_FOUND");
    }
    if (!post.allowComments) {
      return fail("Comments are closed on this post.", 403, "COMMENTS_DISABLED");
    }
    if (!input.comment.trim()) {
      return fail("Write something before posting.", 422, "COMMENT_REQUIRED");
    }
    return respond({ message: "Thanks — your comment is awaiting approval." });
  },
};
