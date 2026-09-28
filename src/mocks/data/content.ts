import type {
  AboutDescriptionBlock,
  AboutStat,
  ContactDetailsBlock,
  FeatureHighlight,
  HomeHero,
  PageBanner,
  SectionHeader,
} from "@/types";

/**
 * CMS-controlled page copy. In production these come from the admin dashboard;
 * here they are static so the storefront renders identically every time.
 */

export const homeHero: HomeHero = {
  badge: "EST. 2016 · DAMASCUS",
  title: "MADE TO",
  subtitle: "BE WALKED IN",
  description:
    "Footwear and leather goods lasted by hand in our Damascus workshop, and sold in six cities. Every pair is built to be resoled, not replaced.",
  ctaPrimary: "Shop the collection",
  ctaPrimaryLink: "/shop",
  ctaSecondary: "Inside the workshop",
  ctaSecondaryLink: "/about-us",
  heroImage:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format&fit=crop",
  stats: [
    { value: "44", label: "Styles in stock" },
    { value: "6", label: "Stores" },
    { value: "4.6", label: "Average rating" },
  ],
};

export const featuredCategoriesHeader = {
  title: "Shop by category",
  subtitle: "Eight collections, one workshop.",
};

export const newArrivalsHeader: SectionHeader = {
  title: "New Arrivals",
  subtitle: "Just landed",
  description: "The most recent additions to the collection, straight off the last.",
  buttonText: "View all",
  buttonLink: "/shop?sort=newest",
};

export const bestSellersHeader: SectionHeader = {
  title: "Best Sellers",
  subtitle: "Most reordered",
  description: "The pairs our customers come back for — and buy in a second colour.",
  buttonText: "View all",
  buttonLink: "/shop?sort=bestseller",
};

export const featuredProductsHeader: SectionHeader = {
  title: "FEATURED",
  subtitle: "THE ATELIER EDIT",
  description:
    "A rotating selection chosen by the studio — the pairs we are most pleased with this season.",
  buttonText: "See more",
  buttonLink: "/shop?featured=true",
};

export const onSaleHeader: SectionHeader = {
  title: "ON SALE",
  subtitle: "UP TO 30% OFF",
  description: "End-of-season pricing on selected styles while sizes last.",
  buttonText: "See more",
  buttonLink: "/shop?onSale=true",
};

export const latestBlogHeader = {
  title: "From the Journal",
  description:
    "Notes on construction, fit and care from the people who make and test the shoes.",
};

export const newsletterHeader = {
  title: "Get the fit notes first",
  description:
    "One email a month: new lasts, restocks, and the care guides we wish came in the box. No discount spam.",
};

export const whyChooseUs: { title: string; subtitle: string; features: FeatureHighlight[] } = {
  title: "Why buy from us",
  subtitle: "Four commitments we hold ourselves to on every order.",
  features: [
    {
      id: 1,
      icon: "Truck",
      title: "Free shipping over $150",
      description: "Standard delivery in 2–4 working days across the region, tracked end to end.",
    },
    {
      id: 2,
      icon: "RotateCcw",
      title: "30-day returns",
      description: "Wear them indoors for a month. If the fit is wrong, send them back on us.",
    },
    {
      id: 3,
      icon: "BadgeCheck",
      title: "Built to be resoled",
      description: "Welted and Blake-stitched construction on every leather-soled pair we make.",
    },
    {
      id: 4,
      icon: "Headphones",
      title: "Real fit advice",
      description: "Ask us about a size and you get a measurement back, not a link to a chart.",
    },
  ],
};

export const shopBanner: PageBanner = {
  title: "THE COLLECTION",
  subtitle: "44 styles across heels, boots, sandals, sneakers, bags and jewelry",
  backgroundImage:
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "FREE SHIPPING OVER $150",
  rightBadge: "NEW SEASON 2026",
};

export const blogBanner: PageBanner = {
  title: "JOURNAL",
  subtitle: "Craft, fit and care",
  backgroundImage:
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "WRITTEN IN-HOUSE",
  rightBadge: "UPDATED MONTHLY",
};

export const aboutBanner: PageBanner = {
  title: "ABOUT US",
  subtitle: "Eleven people, one workshop",
  backgroundImage:
    "https://images.unsplash.com/photo-1489367874814-f5d040621dd8?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "EST. 2016",
  rightBadge: "MADE IN DAMASCUS",
};

export const storesBanner: PageBanner = {
  title: "WHERE TO FIND US",
  subtitle: "Six stores across four countries",
  backgroundImage:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "TRY BEFORE YOU BUY",
  rightBadge: "FREE FITTING SERVICE",
};

export const contactBanner: PageBanner = {
  title: "CONTACT US",
  subtitle: "We answer within one working day",
  backgroundImage:
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80&auto=format&fit=crop",
  leftBadge: "SAT–THU 09:00 – 18:00",
  rightBadge: "SUPPORT IN AR / EN",
};

export const aboutDescription: AboutDescriptionBlock = {
  title: "A WORKSHOP, NOT A FACTORY",
  subtitle: "Our story",
  description:
    "Magic Show started in 2016 with three people, one clicking press and a rented room in Bab Sharqi. We had spent years watching good lasts get compromised in volume production and wanted to find out what happened if nobody was allowed to compromise them. Ten years later there are eleven of us, six stores, and the same press.",
  image:
    "https://images.unsplash.com/photo-1554342872-034a06541bad?w=1200&q=80&auto=format&fit=crop",
  features: [
    "Every Atelier pair is lasted by hand and rests 48 hours before it leaves",
    "Vegetable-tanned hides from two Tuscan tanneries we have used since day one",
    "Welted or Blake-stitched construction so shoes can be resoled, not binned",
    "Fit notes written by the person who made the pattern",
  ],
  buttonText: "Read the workshop story",
};

export const aboutStats: AboutStat[] = [
  { id: 1, icon: "Users", title: "Customers served", value: 24800, suffix: "+" },
  { id: 2, icon: "Package", title: "Pairs delivered", value: 41200, suffix: "+" },
  { id: 3, icon: "Store", title: "Stores open", value: 6, suffix: "" },
];

export const contactDetails: ContactDetailsBlock = {
  title: "CONTACT DETAIL",
  address: "Al-Hamra Street 42, Abu Rummaneh, Damascus, Syria",
  email: "hello@magicshow.example",
  phone: "+963 11 234 5678",
  fax: "+963 11 331 8821",
  aboutTitle: "ABOUT US",
  aboutText:
    "Magic Show is a footwear and leather goods house based in Damascus, with stores in Aleppo, Beirut, Amman, Dubai and Istanbul. Write to us about sizing, repairs or wholesale and a person will reply — usually the same day, always within one working day.",
};

/** OpenStreetMap embed centred on the Damascus flagship. No API key required. */
export const contactMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=36.2565%2C33.5008%2C36.2965%2C33.5268&layer=mapnik&marker=33.5138%2C36.2765";
