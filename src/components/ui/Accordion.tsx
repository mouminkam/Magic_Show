"use client";

import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type AccordionItemId = string | number;

export interface AccordionItem {
  id: AccordionItemId;
  header: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultExpanded?: AccordionItemId | null;
  /** When true the expanded state is a set instead of a single id. */
  allowMultiple?: boolean;
  onChange?: (expanded: AccordionItemId | null) => void;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/** Animated accordion supporting single-open (default) or multi-open modes. */
export default function Accordion({
  items,
  defaultExpanded = null,
  allowMultiple = false,
  onChange,
  className = "",
  itemClassName = "",
  headerClassName = "",
  contentClassName = "",
}: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<AccordionItemId>>(() =>
    defaultExpanded === null ? new Set() : new Set([defaultExpanded])
  );

  const handleToggle = useCallback(
    (id: AccordionItemId) => {
      setExpanded((current) => {
        const isOpen = current.has(id);
        const next = allowMultiple ? new Set(current) : new Set<AccordionItemId>();

        if (isOpen) {
          next.delete(id);
        } else {
          next.add(id);
        }

        onChange?.(isOpen ? null : id);
        return next;
      });
    },
    [allowMultiple, onChange]
  );

  if (items.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isExpanded = expanded.has(item.id);

        return (
          <div
            key={item.id}
            className={`border border-line rounded-lg overflow-hidden bg-surface transition-shadow ${
              isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"
            } ${itemClassName}`}
          >
            <button
              type="button"
              onClick={() => handleToggle(item.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-sunken ${
                isExpanded ? "bg-sunken" : ""
              } ${headerClassName}`}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex-1 pr-4">{item.header}</div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-muted" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 pt-0 ${contentClassName}`}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
