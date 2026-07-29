"use client";

import type { ReactNode } from "react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { FaPinterest } from "react-icons/fa";

export type SocialIconVariant = "default" | "light" | "dark";
export type SocialIconSize = "sm" | "md" | "lg";
export type SocialIconLayout = "row" | "column";

export interface SocialMediaIconsProps {
  variant?: SocialIconVariant;
  size?: SocialIconSize;
  layout?: SocialIconLayout;
  className?: string;
  showLabels?: boolean;
}

const SIZE_CLASSES: Record<SocialIconSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const VARIANT_CLASSES: Record<SocialIconVariant, string> = {
  default: "bg-ink-900 hover:bg-ink-800",
  light: "bg-sunken border-2 border-line-strong text-ink hover:bg-brand-soft",
  dark: "bg-ink-900 hover:bg-ink-800",
};

const ICON_PIXELS: Record<SocialIconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const LAYOUT_CLASSES: Record<SocialIconLayout, string> = {
  row: "flex space-x-4",
  column: "flex flex-col gap-5",
};

interface SocialLink {
  name: string;
  label: string;
  href: string;
  render: (pixels: number) => ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "pinterest",
    label: "Pinterest",
    href: "https://pinterest.com/magicshow",
    render: (pixels) => <FaPinterest className="text-white" size={pixels} />,
  },
  {
    name: "twitter",
    label: "Twitter",
    href: "https://twitter.com/magicshow",
    render: (pixels) => <Twitter className="text-white" size={pixels} />,
  },
  {
    name: "facebook",
    label: "Facebook",
    href: "https://facebook.com/magicshow",
    render: (pixels) => <Facebook className="text-white" size={pixels} />,
  },
  {
    name: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@magicshow",
    render: (pixels) => <Youtube className="text-white" size={pixels} />,
  },
];

export default function SocialMediaIcons({
  variant = "default",
  size = "md",
  layout = "row",
  className = "",
  showLabels = false,
}: SocialMediaIconsProps) {
  const pixels = ICON_PIXELS[size];

  return (
    <ul className={`social-network ${LAYOUT_CLASSES[layout]} ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-250`}
          >
            {social.render(pixels)}
            {showLabels && <span className="ml-2 text-sm">{social.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
