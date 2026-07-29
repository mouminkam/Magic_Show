import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils/imageUtils";

export interface LatestBlogCardPost {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
}

export interface LatestBlogCardProps {
  post: LatestBlogCardPost;
}

export default function LatestBlogCard({ post }: LatestBlogCardProps) {
  const href = `/blog/${post.id}`;

  return (
    <article className="group relative bg-surface rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl border border-line">
      <Link
        href={href}
        className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-100 to-ink-200"
      >
        <Image
          src={resolveImageUrl(post.image)}
          alt={post.title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="flex flex-col flex-1 p-6 md:p-7 lg:p-8">
        <div className="flex items-center gap-3 md:gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted group-hover:text-orange-600 transition-colors duration-300">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sunken group-hover:bg-orange-50 transition-all duration-300">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <time className="font-medium">{post.date}</time>
          </div>

          <div className="w-1 h-1 rounded-full bg-ink-200" />

          <div className="flex items-center gap-2 text-xs md:text-sm text-muted group-hover:text-orange-600 transition-colors duration-300">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sunken group-hover:bg-orange-50 transition-all duration-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{post.author}</span>
          </div>
        </div>

        <div className="w-10 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mb-5 transform origin-left transition-all duration-500 group-hover:w-16 group-hover:scale-105" />

        <h3 className="flex-1 mb-6">
          <Link
            href={href}
            className="text-lg md:text-xl lg:text-2xl font-bold text-ink leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-orange-600"
          >
            {post.title}
          </Link>
        </h3>

        <Link
          href={href}
          className="relative inline-flex border-2 border-orange-500 items-center justify-center gap-2 px-6 py-3.5 bg-surface text-orange-500 font-semibold text-sm rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-[var(--shadow-lg)] group-hover:shadow-orange-500/40 mt-auto"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out origin-left" />
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              Read More
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-200/30 transition-colors duration-500 pointer-events-none" />
    </article>
  );
}
