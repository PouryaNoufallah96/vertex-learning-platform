import type { ReactNode } from "react";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { DockerMark, NextjsMark, TypeScriptMark } from "@/components/brand/course-marks";
import { CourseCard } from "@/components/cards/course-card";
import { ChartDecoration } from "@/components/home/chart-decoration";
import { Hero } from "@/components/home/hero";
import { PageFrame } from "@/components/layout/page-frame";
import { SiteHeader } from "@/components/layout/site-header";

interface HomeCourse {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: string;
  logo: ReactNode;
}

/** Placeholder until courses are read from Sanity; the shape mirrors the course document. */
const courses: HomeCourse[] = [
  {
    slug: "nextjs-for-production",
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modules: "12 modules",
    logo: <NextjsMark />,
  },
  {
    slug: "docker-essentials",
    title: "Docker Essentials",
    description: "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    modules: "8 modules",
    logo: <DockerMark />,
  },
  {
    slug: "typescript-deep-dive",
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    modules: "10 modules",
    logo: <TypeScriptMark />,
  },
];

export default function Home() {
  return (
    <PageFrame>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Hero />

        <section className="border-t border-canvas-line px-6 pt-14 pb-16 sm:px-12 xl:px-18 xl:pt-16 xl:pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-[30px] leading-9 font-bold text-neutral-900">
              All Courses
            </h2>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xs text-[15px] font-medium text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              View all courses
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <li key={course.slug} className="flex min-w-0">
                <Link
                  href={`/courses/${course.slug}`}
                  className="flex min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  <CourseCard
                    layout="stacked"
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    duration={course.duration}
                    modules={course.modules}
                    logo={course.logo}
                    className="min-w-0 flex-1 border-canvas-line shadow-none transition-shadow hover:shadow-md"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-16 flex items-center gap-5 text-[17px] text-neutral-700">
            <span className="hidden h-px flex-1 bg-canvas-line sm:block" />
            <Star className="size-6 shrink-0 text-primary-500" strokeWidth={2} aria-hidden />
            <span className="text-center">New courses and lessons added every week.</span>
            <span className="hidden h-px flex-1 bg-canvas-line sm:block" />
          </p>
        </section>

        <ChartDecoration className="mt-auto" />
      </main>
    </PageFrame>
  );
}
