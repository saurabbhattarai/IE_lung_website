import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ServiceBreadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-6 flex-wrap">
      <Link href="/" className="hover:text-accent transition-colors">
        Home
      </Link>
      <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
      <Link href="/#services" className="hover:text-accent transition-colors">
        Services
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-2">
            <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
            {isLast || !item.href ? (
              <span className="text-accent font-medium truncate max-w-[240px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
