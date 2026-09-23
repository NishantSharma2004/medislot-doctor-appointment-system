import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, X, ArrowRight, Sparkles, BookOpen, Clock } from "lucide-react";
import { getAllBlogs, type BlogPost } from "@/data/blogs-data";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Blogs & Clinical Insights — Durrmi" },
      {
        name: "description",
        content:
          "Conversations worth sitting with. Evidence-based insights from licensed therapists and honest stories from people navigating mental health, one article at a time.",
      },
    ],
  }),
  component: BlogsListingPage,
});

const CATEGORIES = [
  "All Articles",
  "Anxiety Disorder",
  "Emotional Health",
  "Mindfulness",
  "Workplace Stress",
  "Relationships",
  "Sleep & Recovery",
];

export function BlogsListingPage() {
  const allBlogs = getAllBlogs();
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter posts
  const filteredBlogs = allBlogs.filter((post) => {
    const matchCategory =
      selectedCategory === "All Articles" ||
      post.categories.includes(selectedCategory);
    const matchSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.categories.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchCategory && matchSearch;
  });

  // Featured 3 posts at top
  const featuredPosts = filteredBlogs.slice(0, 3);
  // Remainder for Latest Blogs section
  const latestPosts = filteredBlogs;

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* 1. HERO SECTION (Matching Figma Blogs Listing) */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16 border-b border-amber-200/40">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-[#FFEAA7]/30 via-[#FFF4D4]/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Conversations Worth Sitting With
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Insights from our therapists and stories from people navigating mental health, one article at a time.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or title..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FFBE0B] text-slate-950 shadow-sm scale-105 border border-amber-400"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* TOP ROW: 3 FEATURED BLOG CARDS (Matching Figma Blogs Listing Top Row) */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-3.5 sm:p-4"
              >
                {/* Image Container with Yellow Badge */}
                <Link
                  to="/blogs/$blogId"
                  params={{ blogId: post.slug || post.id }}
                  className="block relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100"
                >
                  <img
                    src={post.heroImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs">
                    {post.categories[0] || "Anxiety Disorder"}
                  </span>
                </Link>

                {/* Card Content */}
                <div className="pt-3.5 pb-1 flex flex-col flex-1">
                  <p className="text-[11px] font-bold text-slate-400">
                    {post.date} • {post.readTime}
                  </p>
                  
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                    <Link to="/blogs/$blogId" params={{ blogId: post.slug || post.id }}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 pt-2 border-t border-slate-100">
                    <Link
                      to="/blogs/$blogId"
                      params={{ blogId: post.slug || post.id }}
                      className="text-xs font-black text-slate-900 hover:text-amber-700 underline underline-offset-4 decoration-amber-400 flex items-center gap-1"
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

      {/* 2. LATEST BLOGS SECTION (Matching Figma Blogs Listing Lower Section) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header with Horizontal Divider Line */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pb-3">
              Latest Blogs
            </h2>
            <div className="border-b border-slate-200" />
          </div>

          {latestPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-semibold text-xs">
              No blogs found matching "{searchQuery}".
            </div>
          ) : (
            <>
              {/* Responsive Magazine Grid Matching Figma Image 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                
                {latestPosts.slice(0, visibleCount).map((post, idx) => {
                  const isHorizontal = idx % 3 === 1 || idx % 3 === 2;

                  if (isHorizontal) {
                    return (
                      <article
                        key={post.id}
                        className="group flex flex-col sm:flex-row gap-4 rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-3.5"
                      >
                        {/* Left Image */}
                        <Link
                          to="/blogs/$blogId"
                          params={{ blogId: post.slug || post.id }}
                          className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-slate-100"
                        >
                          <img
                            src={post.heroImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#FFE27D] text-slate-950 text-[10px] font-bold shadow-xs">
                            {post.categories[0] || "Anxiety Disorder"}
                          </span>
                        </Link>

                        {/* Right Content */}
                        <div className="flex flex-col justify-between py-1 flex-1">
                          <div>
                            <p className="text-[11px] font-bold text-slate-400">
                              {post.date} • {post.readTime}
                            </p>
                            <h3 className="text-base font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                              <Link to="/blogs/$blogId" params={{ blogId: post.slug || post.id }}>
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1.5 line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="mt-3">
                            <Link
                              to="/blogs/$blogId"
                              params={{ blogId: post.slug || post.id }}
                              className="text-xs font-black text-slate-900 hover:text-amber-700 underline underline-offset-4 decoration-amber-400"
                            >
                              Read More
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  // Standard vertical card
                  return (
                    <article
                      key={post.id}
                      className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 p-3.5 sm:p-4"
                    >
                      <Link
                        to="/blogs/$blogId"
                        params={{ blogId: post.slug || post.id }}
                        className="block relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100"
                      >
                        <img
                          src={post.heroImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs">
                          {post.categories[0] || "Anxiety Disorder"}
                        </span>
                      </Link>

                      <div className="pt-3.5 pb-1 flex flex-col flex-1">
                        <p className="text-[11px] font-bold text-slate-400">
                          {post.date} • {post.readTime}
                        </p>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                          <Link to="/blogs/$blogId" params={{ blogId: post.slug || post.id }}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 pt-2 border-t border-slate-100">
                          <Link
                            to="/blogs/$blogId"
                            params={{ blogId: post.slug || post.id }}
                            className="text-xs font-black text-slate-900 hover:text-amber-700 underline underline-offset-4 decoration-amber-400"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}

              </div>

              {/* View More Button Matching Figma */}
              {visibleCount < latestPosts.length && (
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="h-10 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 border border-amber-400"
                  >
                    View more
                  </Button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

    </div>
  );
}
