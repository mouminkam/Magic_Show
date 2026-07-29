import {
  Award,
  BadgeCheck,
  Box,
  CreditCard,
  Globe,
  Headphones,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  Truck,
  TrendingUp,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated Lucide icon set — kept in sync with the backend's
 * `config/magic_lucide_icons.php`, which is what the admin dashboard offers when
 * an editor picks an icon for a section.
 */
export const lucideIconMap = {
  Award,
  BadgeCheck,
  Box,
  CreditCard,
  Globe,
  Headphones,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Send,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  Truck,
  TrendingUp,
  User,
  Users,
  Zap,
} satisfies Record<string, LucideIcon>;

export type LucideIconName = keyof typeof lucideIconMap;

/**
 * Resolves a PascalCase icon name coming from content data into a component.
 * Unknown names fall back to `Package` rather than crashing the section.
 */
export function getLucideIconComponent(
  name: string | null | undefined,
  fallback: LucideIcon = Package
): LucideIcon {
  if (!name) return fallback;
  return Object.hasOwn(lucideIconMap, name)
    ? lucideIconMap[name as LucideIconName]
    : fallback;
}
