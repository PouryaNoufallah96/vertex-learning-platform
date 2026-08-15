import type { ReactNode } from "react";
import { BarChart3, Clock, FolderClosed } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
  /** Square brand tile shown to the left of the title. */
  logo?: ReactNode;
  className?: string;
}

export function CourseCard({
  title,
  description,
  level,
  duration,
  modules,
  logo,
  className,
}: CourseCardProps) {
  return (
    <Card className={cn("gap-5", className)}>
      <div className="flex items-start gap-4">
        {logo ?? (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-display text-[22px] leading-none font-bold text-white">
            {title.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-heading-3 text-neutral-900">{title}</h3>
          <p className="mt-1 text-body text-neutral-500">{description}</p>
        </div>
      </div>
      <CardFooter className="justify-start gap-5 pt-0">
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-small text-neutral-500">
          <BarChart3 className="size-4 text-neutral-500" strokeWidth={2} aria-hidden />
          {level}
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-small text-neutral-500">
          <Clock className="size-4 text-neutral-500" strokeWidth={2} aria-hidden />
          {duration}
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-small text-neutral-500">
          <FolderClosed className="size-4 text-neutral-500" strokeWidth={2} aria-hidden />
          {modules}
        </span>
      </CardFooter>
    </Card>
  );
}
