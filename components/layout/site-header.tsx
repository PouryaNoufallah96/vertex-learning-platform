import { Bell } from "lucide-react";
import { Navbar } from "@/components/nav/navbar";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  /** href of the nav link to mark as current. */
  activeHref?: string;
  /** Name behind the avatar; replaced by the signed-in user once auth lands. */
  userName?: string;
  className?: string;
}

export function SiteHeader({ activeHref, userName = "Alex Rivera", className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "flex min-h-24 flex-wrap items-center justify-between gap-4 border-b border-canvas-line px-6 py-4 sm:px-10 xl:px-15",
        className,
      )}
    >
      <Navbar activeHref={activeHref} />
      <div className="ml-auto flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-xs text-neutral-900 transition-colors hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Bell className="size-6" strokeWidth={2} aria-hidden />
        </button>
        <Avatar name={userName} />
      </div>
    </header>
  );
}
