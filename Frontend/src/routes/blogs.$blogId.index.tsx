import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
} from "lucide-react";
import { getBlogByIdOrSlug, getLatestBlogs, type BlogPost } from "@/data/blogs-data";
import { toast } from "sonner";

export const Route = createFileRoute("/blogs/$blogId/")({
  head: () => ({
    meta: [
      { title: "The Advice We Give Anxious People That Doesn't Help — Durrmi Blog" },
      {
        name: "description",
        content:
          "Why casual reassurance often backfires in high-anxiety situations, and evidence-based strategies from clinical psychologists that genuinely restore calm.",
      },
    ],
  }),
  component: BlogDetailPage,
});

export function BlogDetailPage() {
  const { blogId } = useParams({ from: "/blogs/$blogId/" });
  const post = getBlogByIdOrSlug(blogId) || getBlogByIdOrSlug("1")!;
  const latestBlogs = getLatestBlogs(post.id, 6);

  // Carousel slider state for bottom Latest Blogs
  const [carouselIndex, setCarouselIndex] = useState(0);
  const cardsPerPage = 3;
  const maxIndex = Math.max(0, latestBlogs.length - cardsPerPage);

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.subtitle || post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* 1. ARTICLE HEADER (Matching Figma Blog Detail Page_v2.0) */}
      <article className="pt-12 sm:pt-16 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Back link */}
          <div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to all blogs
            </Link>
          </div>

          {/* Category Pill Badges matching Figma: Category: [Anxiety Disorder] [Anxiety Disorder] */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Category:</span>
            {post.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-xs font-bold shadow-2xs"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] pt-2">
            {post.title}
          </h1>

          {/* Lead Subtitle */}
          {post.subtitle && (
            <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Meta Date & Read Time matching Figma: Date: 12-03-25 Read: 5 mins */}
          <div className="flex items-center justify-between py-2 text-xs font-bold text-slate-500 border-b border-slate-200/80">
            <div className="flex items-center gap-6">
              <span>Date: <strong className="text-slate-800">{post.date}</strong></span>
              <span>Read: <strong className="text-slate-800">{post.readTime}</strong></span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <Share2 className="size-3.5" /> Share
            </button>
          </div>

          {/* Large Hero Image (Person with pillow on bed matching Figma) */}
          <div className="pt-4">
            <div className="aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={post.heroImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* 2. ARTICLE BODY CONTENT (Matching Figma Image 2 & 3 text) */}
          <div className="pt-8 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
            
            {/* Intro paragraph blocks */}
            <div className="space-y-4">
              {post.content.intro.split("\n\n").map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Dynamic Article Sections */}
            {post.content.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4 pt-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {section.heading}
                </h2>

                {/* Mid-Article Consultation Image on section 2 matching Figma */}
                {sIdx === 1 && post.midImageUrl && (
                  <div className="my-6 aspect-[16/8] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={post.midImageUrl}
                      alt="Therapist and client discussion"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}

                {section.highlightQuote && (
                  <blockquote className="my-6 border-l-4 border-amber-400 pl-4 py-2 text-base sm:text-lg font-bold italic text-slate-900 bg-amber-50/60 rounded-r-xl">
                    "{section.highlightQuote}"
                  </blockquote>
                )}
              </div>
            ))}

            {/* In-Article Therapist Callout Banner */}
            <div className="my-10 rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5 text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wide">
                  <HeartHandshake className="size-4 text-amber-600" /> Professional 1-on-1 Guidance
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Ready to explore tools tailored to you?
                </h3>
                <p className="text-xs font-semibold text-slate-600 max-w-lg">
                  Connect with licensed psychologists who validate your reality and guide you through evidence-based cognitive therapy.
                </p>
              </div>
              <Button asChild size="lg" className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 border border-amber-400">
                <Link to="/doctors">Find a Therapist</Link>
              </Button>
            </div>

          </div>

        </div>
      </article>

      {/* 3. LATEST BLOGS CAROUSEL (Matching Figma Image 3 Bottom Section) */}
      <section className="bg-[#FFFDF9] py-16 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Row with Prev / Next Arrow Buttons */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Latest Blogs
            </h2>

            {/* Carousel navigation arrows matching Figma */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className="size-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                aria-label="Previous blogs"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={carouselIndex >= maxIndex}
                className="size-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
                aria-label="Next blogs"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* 3 Related Cards in responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {latestBlogs.slice(carouselIndex, carouselIndex + cardsPerPage).map((item) => (
              <article
                key={item.id}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-3.5 sm:p-4"
              >
                <Link
                  to="/blogs/$blogId"
                  params={{ blogId: item.slug || item.id }}
                  className="block relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100"
                >
                  <img
                    src={item.heroImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs">
                    {item.categories[0] || "Anxiety Disorder"}
                  </span>
                </Link>

                <div className="pt-3.5 pb-1 flex flex-col flex-1">
                  <p className="text-[11px] font-bold text-slate-400">
                    {item.date} • {item.readTime}
                  </p>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                    <Link to="/blogs/$blogId" params={{ blogId: item.slug || item.id }}>
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 pt-2 border-t border-slate-100">
                    <Link
                      to="/blogs/$blogId"
                      params={{ blogId: item.slug || item.id }}
                      className="text-xs font-black text-slate-900 hover:text-amber-700 underline underline-offset-4 decoration-amber-400"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
