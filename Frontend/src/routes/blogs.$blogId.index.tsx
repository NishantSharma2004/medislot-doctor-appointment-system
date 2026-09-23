import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBlogByIdOrSlug, getLatestBlogs } from "@/data/blogs-data";

export const Route = createFileRoute("/blogs/$blogId/")({
  head: () => ({
    meta: [
      { title: "The Advice We Give Anxious People That Doesn't Help — Durrmi Blog" },
      {
        name: "description",
        content:
          "If you've ever dealt with anxiety, chances are you've heard some version of this: Just relax. Don't overthink it. It's all in your head. Just breathe. And chances are, none of it actually helped.",
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

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* Soft Ambient Warm Glow on margins matching Figma */}
      <div className="fixed inset-y-0 left-0 w-32 bg-gradient-to-r from-amber-100/20 to-transparent pointer-events-none -z-10" />
      <div className="fixed inset-y-0 right-0 w-32 bg-gradient-to-l from-amber-100/20 to-transparent pointer-events-none -z-10" />

      {/* ARTICLE CONTAINER (Matching Figma Blog Detail Page_v2.0) */}
      <article className="pt-10 sm:pt-14 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-5">
          
          {/* Category Pill Badges matching Figma: Category: [Anxiety Disorder] [Anxiety Disorder] */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
            <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-[11px] font-bold shadow-2xs">
              Anxiety Disorder
            </span>
            <span className="px-3.5 py-1 rounded-full border border-slate-300 bg-white text-slate-800 text-[11px] font-bold shadow-2xs">
              Anxiety Disorder
            </span>
          </div>

          {/* Article Title matching Figma */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.18] pt-1">
            The Advice We Give Anxious People<br className="hidden sm:inline" /> That Doesn't Help
          </h1>

          {/* Lead Subtitle matching Figma */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
            If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
          </p>

          {/* Meta Date & Read Time matching Figma: Date: 12-03-25        Read: 5 mins */}
          <div className="flex items-center gap-10 sm:gap-14 pt-2 text-xs font-medium text-slate-600">
            <div>
              Date: <span className="font-black text-slate-900 ml-1">12-03-25</span>
            </div>
            <div>
              Read: <span className="font-black text-slate-900 ml-1">5 mins</span>
            </div>
          </div>

          {/* Large Hero Image (Person with pillow on bed matching Figma) */}
          <div className="pt-4">
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={post.heroImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* ARTICLE BODY CONTENT (Exact match to Figma Image) */}
          <div className="pt-6 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
            
            {/* Block 1 */}
            <div className="space-y-4">
              <p>
                If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
              </p>
              <p>
                That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.
              </p>
              <p>
                Let's look at why some of the most common things people say don't land, and what actually tends to help.
              </p>
            </div>

            {/* Subheading 1 */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Blog Heading
              </h2>
              <p>
                If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
              </p>
              <p>
                That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.
              </p>
              <p>
                Let's look at why some of the most common things people say don't land, and what actually tends to help.
              </p>
              <p>
                If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
              </p>
              <p>
                That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.
              </p>
            </div>

            {/* Subheading 2 */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Blog Heading
              </h2>

              {/* Mid-Article Consultation Image matching Figma */}
              {post.midImageUrl && (
                <div className="my-5 aspect-[16/7] w-full rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={post.midImageUrl}
                    alt="Therapist and client discussion"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <p>
                If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
              </p>
              <p>
                That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.
              </p>
              <p>
                Let's look at why some of the most common things people say don't land, and what actually tends to help.
              </p>
              <p>
                If you've ever dealt with anxiety, chances are you've heard some version of this:"Just relax." "Don't overthink it." "It's all in your head." "Just breathe."And chances are, none of it actually helped.
              </p>
              <p>
                That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.
              </p>
            </div>

          </div>

        </div>
      </article>

      {/* LATEST BLOGS CAROUSEL SECTION (Matching Figma Image 3 Bottom Section) */}
      <section className="bg-[#FFFDF9] py-14 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header Row with Prev / Next Arrow Buttons */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Blogs
            </h2>

            {/* Carousel navigation arrows matching Figma */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className="size-8.5 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
                aria-label="Previous blogs"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={carouselIndex >= maxIndex}
                className="size-8.5 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs"
                aria-label="Next blogs"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* 3 Related Cards in responsive grid matching Figma */}
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
