import type {
  AboutDescriptionBlock,
  AboutStat,
  ApiResponse,
  ContactDetailsBlock,
  FeatureHighlight,
  FeaturedCategoryCard,
  FeaturedProductCardData,
  HomeHero,
  HomeReviewCard,
  PageBanner,
  ProductSummary,
  SectionHeader,
  SectionPayload,
  Store,
  TeamMember,
  Testimonial,
} from "@/types";
import { categories } from "../data/taxonomy";
import { products } from "../data/products";
import { reviews } from "../data/reviews";
import { stores, teamMembers, testimonials } from "../data/company";
import {
  aboutBanner,
  aboutDescription,
  aboutStats,
  bestSellersHeader,
  contactBanner,
  contactDetails,
  contactMapUrl,
  featuredCategoriesHeader,
  featuredProductsHeader,
  homeHero,
  latestBlogHeader,
  newArrivalsHeader,
  newsletterHeader,
  onSaleHeader,
  shopBanner,
  storesBanner,
  whyChooseUs,
} from "../data/content";
import { blogPosts } from "../data/blog";
import { toFeaturedCard, toProductSummary } from "../mappers";
import { delay, respond } from "../runtime";

/**
 * Page-section content. Each getter returns a `SectionPayload`, mirroring the
 * admin's per-section on/off switch: `{ enabled: false, data: null }` means the
 * storefront must render nothing for that slot.
 */

function enabled<T>(data: T): SectionPayload<T> {
  return { enabled: true, data };
}

function disabled<T>(): SectionPayload<T> {
  return { enabled: false, data: null };
}

export interface ProductSectionData {
  header: SectionHeader;
  products: ProductSummary[];
}

export interface FeaturedProductsData {
  featuredHeader: SectionHeader;
  onSaleHeader: SectionHeader;
  featuredProducts: FeaturedProductCardData[];
  onSaleProducts: FeaturedProductCardData[];
}

export interface FeaturedCategoriesData {
  title: string;
  subtitle: string;
  categories: FeaturedCategoryCard[];
}

export interface WhyChooseUsData {
  title: string;
  subtitle: string;
  features: FeatureHighlight[];
}

export interface LatestBlogData {
  title: string;
  description: string;
  posts: Array<{ id: number; title: string; image: string; date: string; author: string }>;
}

export interface NewsletterSectionData {
  title: string;
  description: string;
}

export interface AboutPageData {
  hero: PageBanner;
  description: AboutDescriptionBlock;
  stats: AboutStat[];
  team: TeamMember[];
  testimonials: Testimonial[];
}

export interface ContactPageData {
  hero: PageBanner;
  mapUrl: string;
  details: ContactDetailsBlock;
}

export interface StoresPageData {
  banner: PageBanner;
  stores: Store[];
}

export const contentService = {
  /* ---------------------------------------------------------------- home -- */

  async getHomeHero(): Promise<SectionPayload<HomeHero>> {
    await delay();
    return enabled(homeHero);
  },

  async getFeaturedCategories(): Promise<SectionPayload<FeaturedCategoriesData>> {
    await delay();
    const cards: FeaturedCategoryCard[] = categories
      .filter((category) => category.parentSlug === null && category.isActive)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image:
          category.image ??
          "https://images.unsplash.com/photo-1520256862855-398228c41684?w=900&q=80&auto=format&fit=crop",
        link: `/shop?category=${category.slug}`,
      }));

    return cards.length > 0
      ? enabled({ ...featuredCategoriesHeader, categories: cards })
      : disabled();
  },

  async getNewArrivals(): Promise<SectionPayload<ProductSectionData>> {
    await delay();
    const items = products
      .filter((product) => product.isNewArrival)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, 8)
      .map(toProductSummary);
    return items.length > 0 ? enabled({ header: newArrivalsHeader, products: items }) : disabled();
  },

  async getBestSellers(): Promise<SectionPayload<ProductSectionData>> {
    await delay();
    const items = products
      .filter((product) => product.isBestSeller)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 8)
      .map(toProductSummary);
    return items.length > 0 ? enabled({ header: bestSellersHeader, products: items }) : disabled();
  },

  async getFeaturedProducts(): Promise<SectionPayload<FeaturedProductsData>> {
    await delay();
    const featured = products.filter((product) => product.isFeatured).slice(0, 6);
    const onSale = products
      .filter((product) => product.salePrice !== null)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 6);

    if (featured.length === 0 && onSale.length === 0) return disabled();

    return enabled({
      featuredHeader: featuredProductsHeader,
      onSaleHeader,
      featuredProducts: featured.map(toFeaturedCard),
      onSaleProducts: onSale.map(toFeaturedCard),
    });
  },

  async getWhyChooseUs(): Promise<SectionPayload<WhyChooseUsData>> {
    await delay();
    return whyChooseUs.features.length > 0 ? enabled(whyChooseUs) : disabled();
  },

  async getCustomerReviews(): Promise<SectionPayload<HomeReviewCard[]>> {
    await delay();
    const cards: HomeReviewCard[] = reviews
      .filter((review) => review.isFeatured)
      .map((review) => ({
        id: review.id,
        name: review.authorName,
        comment: review.comment,
        image: review.authorImage,
        rating: review.rating,
        date: new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(review.createdAt)),
      }));
    return cards.length > 0 ? enabled(cards) : disabled();
  },

  async getLatestBlog(): Promise<SectionPayload<LatestBlogData>> {
    await delay();
    const posts = [...blogPosts]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, 3)
      .map((post) => ({
        id: post.id,
        title: post.title,
        image: post.image,
        date: post.date,
        author: post.author,
      }));
    return posts.length > 0 ? enabled({ ...latestBlogHeader, posts }) : disabled();
  },

  async getNewsletter(): Promise<SectionPayload<NewsletterSectionData>> {
    await delay();
    return enabled(newsletterHeader);
  },

  /* ---------------------------------------------------------------- shop -- */

  async getShopBanner(): Promise<ApiResponse<PageBanner>> {
    return respond(shopBanner);
  },

  /* --------------------------------------------------------------- about -- */

  async getAboutPage(): Promise<ApiResponse<AboutPageData>> {
    return respond({
      hero: aboutBanner,
      description: aboutDescription,
      stats: aboutStats,
      team: [...teamMembers].sort((a, b) => a.sortOrder - b.sortOrder),
      testimonials: [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder),
    });
  },

  /* ------------------------------------------------------------- contact -- */

  async getContactPage(): Promise<ApiResponse<ContactPageData>> {
    return respond({
      hero: contactBanner,
      mapUrl: contactMapUrl,
      details: contactDetails,
    });
  },

  /* -------------------------------------------------------------- stores -- */

  async getStoresPage(): Promise<ApiResponse<StoresPageData>> {
    return respond({
      banner: storesBanner,
      stores: stores.filter((store) => store.isActive),
    });
  },
};
