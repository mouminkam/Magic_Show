import type { Brand, Category, Color, Material, Season, Size } from "@/types";

/**
 * Static taxonomy for the Magic Show catalogue: categories, brands, colours,
 * sizes, materials and seasons. Products reference these by id.
 */

export const categories: Category[] = [
  {
    id: 1,
    name: "Heels",
    slug: "heels",
    description:
      "Stilettos, block heels and kitten heels cut for long evenings and short commutes alike.",
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 2,
    name: "Boots",
    slug: "boots",
    description:
      "Ankle, Chelsea and knee-high silhouettes built on weather-sealed leather.",
    image: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 3,
    name: "Sandals",
    slug: "sandals",
    description: "Flat and heeled sandals in soft nappa, raffia and vegetable-tanned leather.",
    image: "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 4,
    name: "Sneakers",
    slug: "sneakers",
    description: "Court, runner and platform sneakers with cushioned ortholite footbeds.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 5,
    name: "Flats",
    slug: "flats",
    description: "Ballerinas, loafers and mules for days that do not slow down.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 6,
    name: "Bags",
    slug: "bags",
    description: "Totes, crossbodies and clutches finished with solid-brass hardware.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 7,
    name: "Accessories",
    slug: "accessories",
    description: "Belts, scarves and small leather goods that finish the look.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 8,
    name: "Jewelry",
    slug: "jewelry",
    description: "Gold-plated and sterling silver pieces made in small batches.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: null,
  },
  {
    id: 9,
    name: "Stiletto Heels",
    slug: "stiletto-heels",
    description: "Sharp 90-110mm heels on a reinforced steel shank.",
    image: "https://images.unsplash.com/photo-1520256862855-398228c41684?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: "heels",
  },
  {
    id: 10,
    name: "Block Heels",
    slug: "block-heels",
    description: "Stacked 50-70mm heels that carry weight through the whole footbed.",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: "heels",
  },
  {
    id: 11,
    name: "Ankle Boots",
    slug: "ankle-boots",
    description: "Cropped shafts that sit just above the ankle bone.",
    image: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: "boots",
  },
  {
    id: 12,
    name: "Knee-High Boots",
    slug: "knee-high-boots",
    description: "Full-shaft boots with elasticated calf panels.",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=80&auto=format&fit=crop",
    isActive: true,
    parentSlug: "boots",
  },
];

export const brands: Brand[] = [
  {
    id: 1,
    name: "Magic Show Atelier",
    slug: "magic-show-atelier",
    description:
      "The in-house line. Every pair is lasted and finished in the Damascus workshop.",
    logo: "/images/logo.png",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 2,
    name: "Verano",
    slug: "verano",
    description: "Spanish leather goods house working out of Elda since 1978.",
    logo: "/images/logo.png",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Nordveil",
    slug: "nordveil",
    description: "Copenhagen studio known for minimal lasts and matte hardware.",
    logo: "/images/logo.png",
    isActive: true,
    isFeatured: false,
  },
  {
    id: 4,
    name: "Cassera",
    slug: "cassera",
    description: "Milanese label specialising in sculpted heels and architectural soles.",
    logo: "/images/logo.png",
    isActive: true,
    isFeatured: true,
  },
  {
    id: 5,
    name: "Solene",
    slug: "solene",
    description: "Marseille sandal maker using vegetable-tanned hides and cork footbeds.",
    logo: "/images/logo.png",
    isActive: true,
    isFeatured: false,
  },
];

export const colors: Color[] = [
  { id: 1, name: "Black", colorCode: "#111827", isPrimary: true, sortOrder: 1 },
  { id: 2, name: "Ivory", colorCode: "#F8F5EF", isPrimary: false, sortOrder: 2 },
  { id: 3, name: "Camel", colorCode: "#C08B54", isPrimary: false, sortOrder: 3 },
  { id: 4, name: "Burgundy", colorCode: "#6B1F2E", isPrimary: false, sortOrder: 4 },
  { id: 5, name: "Nude", colorCode: "#E3C4AE", isPrimary: false, sortOrder: 5 },
  { id: 6, name: "Navy", colorCode: "#1E2A44", isPrimary: false, sortOrder: 6 },
  { id: 7, name: "Olive", colorCode: "#5A6247", isPrimary: false, sortOrder: 7 },
  { id: 8, name: "Gold", colorCode: "#C9A227", isPrimary: false, sortOrder: 8 },
  { id: 9, name: "Silver", colorCode: "#C0C4C9", isPrimary: false, sortOrder: 9 },
  { id: 10, name: "Cognac", colorCode: "#8B4A2B", isPrimary: false, sortOrder: 10 },
];

export const sizes: Size[] = [
  { id: 1, name: "35", sortOrder: 1 },
  { id: 2, name: "36", sortOrder: 2 },
  { id: 3, name: "37", sortOrder: 3 },
  { id: 4, name: "38", sortOrder: 4 },
  { id: 5, name: "39", sortOrder: 5 },
  { id: 6, name: "40", sortOrder: 6 },
  { id: 7, name: "41", sortOrder: 7 },
  { id: 8, name: "42", sortOrder: 8 },
  { id: 9, name: "S", sortOrder: 9 },
  { id: 10, name: "M", sortOrder: 10 },
  { id: 11, name: "L", sortOrder: 11 },
  { id: 12, name: "One Size", sortOrder: 12 },
];

export const materials: Material[] = [
  {
    id: 1,
    name: "Full-grain leather",
    slug: "full-grain-leather",
    description: "Vegetable-tanned in Tuscany, ages into a deep patina.",
  },
  {
    id: 2,
    name: "Suede",
    slug: "suede",
    description: "Brushed calf split with a water-repellent finish.",
  },
  {
    id: 3,
    name: "Patent leather",
    slug: "patent-leather",
    description: "High-shine lacquered calf.",
  },
  {
    id: 4,
    name: "Nappa",
    slug: "nappa",
    description: "Soft lambskin that needs no breaking in.",
  },
  {
    id: 5,
    name: "Canvas",
    slug: "canvas",
    description: "12oz organic cotton canvas, GOTS certified.",
  },
  {
    id: 6,
    name: "Recycled mesh",
    slug: "recycled-mesh",
    description: "Knitted from post-consumer PET.",
  },
  {
    id: 7,
    name: "Gold-plated brass",
    slug: "gold-plated-brass",
    description: "3-micron 18k plating over solid brass.",
  },
  {
    id: 8,
    name: "Sterling silver",
    slug: "sterling-silver",
    description: "925 silver with a rhodium anti-tarnish finish.",
  },
];

export const seasons: Season[] = [
  { id: 1, value: "spring", label: "Spring" },
  { id: 2, value: "summer", label: "Summer" },
  { id: 3, value: "autumn", label: "Autumn" },
  { id: 4, value: "winter", label: "Winter" },
  { id: 5, value: "all-season", label: "All Season" },
];

/** Index helpers — mock services resolve ids to entities through these. */
export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
export const colorById = new Map(colors.map((c) => [c.id, c]));
export const sizeById = new Map(sizes.map((s) => [s.id, s]));
export const materialById = new Map(materials.map((m) => [m.id, m]));
export const seasonByValue = new Map(seasons.map((s) => [s.value, s]));
export const brandById = new Map(brands.map((b) => [b.id, b]));
