import type { EntityId, IsoDateString } from "./common";

/** Editorial article shown on `/blog` and `/blog/[id]`. */
export interface BlogPost {
  id: EntityId;
  title: string;
  slug: string;
  excerpt: string;
  /** Sanitised HTML rendered through DOMPurify. */
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  /** Human-readable publication date, e.g. `"14 MAR 2026"`. */
  date: string;
  publishedAt: IsoDateString;
  readingMinutes: number;
  viewCount: number;
  commentCount: number;
  isFeatured: boolean;
  allowComments: boolean;
}

export interface BlogComment {
  id: EntityId;
  postId: EntityId;
  parentId: EntityId | null;
  author: string;
  authorEmail: string;
  content: string;
  date: string;
  createdAt: IsoDateString;
  isApproved: boolean;
  replies: BlogComment[];
}

/** Payload accepted by `blog.addComment()`. */
export interface BlogCommentInput {
  postId: EntityId;
  authorName: string;
  authorEmail: string;
  comment: string;
}

/** Physical retail location shown on `/stores`. */
export interface Store {
  id: EntityId;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  /** Human-readable opening hours, e.g. `"Sat–Thu 10:00 – 22:00"`. */
  hours: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

/** `Branch` is the backend's name for the same entity. */
export type Branch = Store;

export interface Testimonial {
  id: EntityId;
  customerName: string;
  customerImage: string | null;
  text: string;
  rating: number;
  isFeatured: boolean;
  sortOrder: number;
}

export interface TeamMember {
  id: EntityId;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string | null;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  sortOrder: number;
}

/**
 * A CMS-controlled page section. `enabled: false` means the admin turned the
 * section off, and the storefront must render nothing at all for it.
 */
export type SectionPayload<T> =
  | { enabled: true; data: T }
  | { enabled: false; data: null };

/** Full-bleed banner used at the top of shop/blog/about/contact/stores pages. */
export interface PageBanner {
  title: string;
  subtitle: string | null;
  backgroundImage: string | null;
  leftBadge: string | null;
  rightBadge: string | null;
}

/** Reusable "title + subtitle + CTA" block above a product carousel. */
export interface SectionHeader {
  title: string;
  subtitle: string | null;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HomeHero {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  heroImage: string;
  stats: HeroStat[];
}

export interface FeaturedCategoryCard {
  id: EntityId;
  name: string;
  slug: string;
  image: string;
  link: string;
}

/** Card in the masonry "featured products" grid on the home page. */
export interface FeaturedProductCardData {
  id: EntityId;
  name: string;
  alt: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
}

export interface FeatureHighlight {
  id: EntityId;
  /** PascalCase Lucide icon name, resolved via `lucideIconMap`. */
  icon: string;
  title: string;
  description: string;
}

/** Review card rendered by the home page carousel. */
export interface HomeReviewCard {
  id: EntityId;
  name: string;
  comment: string;
  image: string | null;
  rating: number;
  date: string;
}

export interface AboutStat {
  id: EntityId;
  icon: string;
  title: string;
  value: number;
  suffix: string;
}

export interface AboutDescriptionBlock {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  buttonText: string;
}

export interface ContactDetailsBlock {
  title: string;
  address: string;
  email: string;
  phone: string;
  fax: string;
  aboutTitle: string;
  aboutText: string;
}
