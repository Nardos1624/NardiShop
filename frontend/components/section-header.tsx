import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * Shared heading for home page sections: a small gold label, a title, an
 * optional description and an optional "View all" link.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8962E]">{eyebrow}</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#281E18] md:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-base text-[#5C5148]">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-[#281E18] transition-colors hover:text-[#B8962E]"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
