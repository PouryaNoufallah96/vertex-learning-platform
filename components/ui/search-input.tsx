import type { ComponentPropsWithoutRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<ComponentPropsWithoutRef<"input">, "className" | "type"> {
  /** Accessible label; visually hidden by default. */
  label?: string;
  /** Keyboard hint shown on the right, e.g. "⌘ K". Pass null to hide it. */
  shortcut?: string | null;
  className?: string;
}

export function SearchInput({
  id = "search",
  label = "Search",
  placeholder = "Search anything...",
  shortcut = "⌘ K",
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex h-11 items-center gap-3 rounded-md border border-neutral-200 bg-surface px-4 focus-within:border-primary-400">
        <Search className="size-5 shrink-0 text-neutral-900" strokeWidth={2} aria-hidden />
        <input
          id={id}
          type="search"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-body text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
          {...props}
        />
        {shortcut && (
          <kbd className="shrink-0 rounded-xs border border-neutral-200 px-2 py-1 text-[12px] leading-4 font-sans text-neutral-700">
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
}
