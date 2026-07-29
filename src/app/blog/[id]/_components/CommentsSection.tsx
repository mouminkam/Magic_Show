"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import type { BlogComment, BlogPost, Locale } from "@/types";
import { api } from "@/mocks";
import apiErrorMessage from "@/lib/apiErrorMessage";
import { t } from "@/locales/i18n/getTranslation";
import useToastStore from "@/store/toastStore";

export interface CommentsSectionProps {
  post: BlogPost;
  initialComments: BlogComment[];
  lang: Locale;
}

function countComments(comments: BlogComment[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);
}

interface CommentItemProps {
  comment: BlogComment;
  depth?: number;
}

function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  return (
    <li className={depth > 0 ? "mt-6 ps-6 border-s border-line" : "mt-6"}>
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold uppercase text-white">
          {comment.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-medium text-ink">{comment.author}</span>
            <time dateTime={comment.createdAt} className="text-xs text-faint tnum">
              {comment.date}
            </time>
          </div>
          <p className="mt-2 text-muted leading-7">{comment.content}</p>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <ul>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Renders approved comments and a submission form. New comments are held
 * client-side only, flagged "pending", and never merged into the approved
 * list — matching `blogService.addComment`, which does not persist anything
 * because the real endpoint moderates first too.
 */
export default function CommentsSection({ post, initialComments, lang }: CommentsSectionProps) {
  const [pending, setPending] = useState<BlogComment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toastSuccess = useToastStore((state) => state.success);
  const toastError = useToastStore((state) => state.error);

  const total = countComments(initialComments) + pending.length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authorName.trim() || !authorEmail.trim() || !comment.trim()) {
      toastError("Fill in every field before posting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.blog.addComment({
        postId: post.id,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        comment: comment.trim(),
      });

      setPending((current) => [
        ...current,
        {
          id: -Date.now(),
          postId: post.id,
          parentId: null,
          author: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: comment.trim(),
          date: new Date().toDateString(),
          createdAt: new Date().toISOString(),
          isApproved: false,
          replies: [],
        },
      ]);
      setAuthorName("");
      setAuthorEmail("");
      setComment("");
      toastSuccess(data.message);
    } catch (error) {
      toastError(apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="border-t border-line py-16 lg:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10 flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-muted" />
          <h2 className="text-2xl font-normal uppercase tracking-wide text-ink">
            {total === 1 ? t(lang, "blog_comment_count_one") : t(lang, "blog_comment_count_many", { count: total })}
          </h2>
        </div>

        {(initialComments.length > 0 || pending.length > 0) && (
          <ul>
            {initialComments.map((item) => (
              <CommentItem key={item.id} comment={item} />
            ))}
            {pending.map((item) => (
              <li key={item.id} className="mt-6 opacity-70">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold uppercase text-white">
                    {item.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-medium text-ink">{item.author}</span>
                      <span className="eyebrow text-brand">Pending approval</span>
                    </div>
                    <p className="mt-2 text-muted leading-7">{item.content}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <h3 className="mb-6 text-lg font-medium text-ink">{t(lang, "post_a_comment")}</h3>

          {!post.allowComments ? (
            <p className="text-muted">{t(lang, "comments_disabled")}</p>
          ) : (
            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="comment-name" className="sr-only">
                    {t(lang, "first_name")}
                  </label>
                  <input
                    id="comment-name"
                    type="text"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    placeholder={t(lang, "first_name")}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-line-strong px-4 py-3 text-ink placeholder-faint focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  />
                </div>
                <div>
                  <label htmlFor="comment-email" className="sr-only">
                    {t(lang, "email")}
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    value={authorEmail}
                    onChange={(event) => setAuthorEmail(event.target.value)}
                    placeholder={t(lang, "email")}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-line-strong px-4 py-3 text-ink placeholder-faint focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-ring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="comment-body" className="sr-only">
                  {t(lang, "your_message")}
                </label>
                <textarea
                  id="comment-body"
                  rows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={t(lang, "your_message")}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-line-strong px-4 py-3 text-ink placeholder-faint focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-ring"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-8 py-3 font-semibold text-white transition-all hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? t(lang, "posting_comment") : t(lang, "post_comment")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
