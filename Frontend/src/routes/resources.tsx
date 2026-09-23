import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Headphones,
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  Clock,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Your Go-To Mental Well-Being Library — Durrmi Resources" },
      {
        name: "description",
        content:
          "Explore Durrmi's curated mental health library featuring articles, expert video discussions, and therapy podcasts on anxiety, depression, relationships, and mindfulness.",
      },
    ],
  }),
  component: ResourcesPage,
});

// Category pills for interactive filtering
const CATEGORIES = [
  "All Resources",
  "Anxiety Disorder",
  "Depression Support",
  "Stress Management",
  "Relationships",
  "Work & Burnout",
  "Mindfulness",
];

// Initial Media (Articles) items matching Figma exactly
const ALL_MEDIA_ARTICLES = [
  {
    id: "m-1",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `Understanding how anxiety triggers affect your nervous system is the first step toward effective self-regulation. When stressors arise, somatic grounding exercises — such as 4-7-8 rhythmic breathing and progressive muscle release — help signal to the amygdala that you are safe.\n\nOur certified consultants focus on evidence-based cognitive behavioral strategies that allow you to identify catastrophic thinking loops before they manifest physically.`,
  },
  {
    id: "m-2",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `Living with social anxiety can feel like walking into a room where everyone is evaluating you. In reality, the spotlight effect leads us to drastically overestimate how closely others observe our perceived flaws.\n\nWorking with a licensed therapist allows you to gradually test social assumptions in low-stakes environments, rebuilding genuine confidence without constant self-censorship.`,
  },
  {
    id: "m-3",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `Panic attacks can feel deeply overwhelming, yet they follow a predictable physiological arc that peaks within 10 minutes. Grounding techniques, like anchoring your senses to 5 physical things you can see, 4 you can touch, and 3 you can hear, rapidly pull your focus out of panic.\n\nLearning these tools alongside a trained counselor creates a resilient mental safety net you carry anywhere.`,
  },
  {
    id: "m-4",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `High-functioning anxiety frequently masks itself as perfectionism, extreme work ethic, or constant preparedness. Beneath the surface, the nervous system rarely gets permission to downshift into rest.\n\nUncoupling your self-worth from productivity is vital for long-term health and sustainable emotional balance.`,
  },
  {
    id: "m-5",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `Sleep and anxiety share a bidirectional relationship: poor sleep heightens emotional sensitivity, while racing thoughts prevent the mind from entering deep REM cycles.\n\nSimple evening hygiene protocols—such as a digital sunset 60 minutes before bed and cognitive brain-dumps on paper—help smooth the transition into restful recovery.`,
  },
  {
    id: "m-6",
    tag: "Anxiety Disorder",
    type: "Article",
    readTime: "2 Min Read",
    title: "Media Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    content: `Building long-term emotional resilience is not about eliminating negative emotions entirely, but rather changing how you react when they arise. Acceptance and Commitment Therapy (ACT) teaches how to observe uncomfortable sensations with gentle curiosity.\n\nDurrmi therapists partner with you one-on-one to craft tools tailored specifically to your daily reality.`,
  },
  // Extra articles shown when user clicks "See more"
  {
    id: "m-7",
    tag: "Depression Support",
    type: "Article",
    readTime: "3 Min Read",
    title: "Navigating Low-Energy Days with Compassion",
    description:
      "Practical micro-steps for maintaining self-care and gentle routines when emotional exhaustion sets in.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    content: `On heavy days, standard productivity metrics fail. The goal shifts to gentle maintenance: hydrating, stepping outside for 5 minutes, and acknowledging that rest is not laziness.`,
  },
  {
    id: "m-8",
    tag: "Relationships",
    type: "Article",
    readTime: "4 Min Read",
    title: "De-escalating Conflict: Real Talk for Couples",
    description:
      "Communication frameworks from clinical psychologists to replace defensiveness with open curiosity.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    content: `Healthy communication during disagreement hinges on soft start-ups and validating the emotional experience of your partner, even before resolving the logistical issue.`,
  },
  {
    id: "m-9",
    tag: "Stress Management",
    type: "Article",
    readTime: "3 Min Read",
    title: "Managing Workplace Overwhelm Before Burnout Hits",
    description:
      "How to set boundaries with managers and teammates without guilt, preserving mental bandwidth.",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    content: `Burnout isn't a badge of honor. Protecting non-negotiable boundaries creates superior professional longevity and psychological safety.`,
  },
];

// Videos matching Figma
const ALL_VIDEOS = [
  {
    id: "v-1",
    tag: "Anxiety Disorder",
    type: "Videos",
    watchTime: "5 min watch",
    title: "Video Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    videoUrl: "https://www.youtube-nocookie.com/embed/inpok4MKVLM",
  },
  {
    id: "v-2",
    tag: "Anxiety Disorder",
    type: "Videos",
    watchTime: "5 min watch",
    title: "Video Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    videoUrl: "https://www.youtube-nocookie.com/embed/ZToicYcHIOU",
  },
  {
    id: "v-3",
    tag: "Stress Management",
    type: "Videos",
    watchTime: "8 min watch",
    title: "Calming the Nervous System in Real Time",
    description:
      "Guided somatic therapy session demonstrating the physiological sigh and gentle posture resets to lower heart rate.",
    videoUrl: "https://www.youtube-nocookie.com/embed/m3-O7gPsQK0",
  },
  {
    id: "v-4",
    tag: "Mindfulness",
    type: "Videos",
    watchTime: "6 min watch",
    title: "Mindful Awareness for Busy Minds",
    description:
      "A quick walkthrough on establishing short, meaningful meditation breaks throughout your demanding work schedule.",
    videoUrl: "https://www.youtube-nocookie.com/embed/inpok4MKVLM",
  },
];

// Podcasts matching Figma (Screenshot 2)
const ALL_PODCASTS = [
  {
    id: "p-1",
    tag: "Anxiety Disorder",
    type: "Podcasts",
    listenTime: "15 min listen",
    title: "Video Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    audioDuration: "15:20",
  },
  {
    id: "p-2",
    tag: "Anxiety Disorder",
    type: "Podcasts",
    listenTime: "15 min listen",
    title: "Video Mention Brief",
    description:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    imageUrl:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    audioDuration: "18:45",
  },
  {
    id: "p-3",
    tag: "Depression Support",
    type: "Podcasts",
    listenTime: "22 min listen",
    title: "Healing Unpacked: Small Victories Matter",
    description:
      "A candid discussion between clinical psychologists on redefining healing as a nonlinear, compassionate journey.",
    imageUrl:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
    audioDuration: "22:10",
  },
  {
    id: "p-4",
    tag: "Relationships",
    type: "Podcasts",
    listenTime: "19 min listen",
    title: "Attachment Styles & Emotional Safety",
    description:
      "Exploring how our earliest relationship patterns shape communication and how to cultivate secure attachment.",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    audioDuration: "19:05",
  },
];

export function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Resources");
  const [searchQuery, setSearchQuery] = useState("");

  // "See more" state counters
  const [mediaLimit, setMediaLimit] = useState(6);
  const [videoLimit, setVideoLimit] = useState(2);
  const [podcastLimit, setPodcastLimit] = useState(2);

  // Modals for previewing content
  const [activeArticle, setActiveArticle] = useState<typeof ALL_MEDIA_ARTICLES[0] | null>(null);
  const [activeVideo, setActiveVideo] = useState<typeof ALL_VIDEOS[0] | null>(null);
  const [activePodcast, setActivePodcast] = useState<typeof ALL_PODCASTS[0] | null>(null);

  // Filter media
  const filteredMedia = ALL_MEDIA_ARTICLES.filter((item) => {
    const matchCat =
      selectedCategory === "All Resources" || item.tag === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter videos
  const filteredVideos = ALL_VIDEOS.filter((item) => {
    const matchCat =
      selectedCategory === "All Resources" || item.tag === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filter podcasts
  const filteredPodcasts = ALL_PODCASTS.filter((item) => {
    const matchCat =
      selectedCategory === "All Resources" || item.tag === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-14">
        {/* Soft Warm Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#FFE8A3]/30 via-[#FFF3D1]/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Your Go-To Mental Well-Being<br className="hidden sm:inline" /> Library
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
            Evidence-based insights, clinical discussions, and wellness guides curated by Durrmi's verified therapists.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, videos, or podcasts..."
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

          {/* Topic Pills Cloud */}
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
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 pb-24">
        
        {/* ========================================================= */}
        {/* 2. MEDIA SECTION (Articles)                                */}
        {/* ========================================================= */}
        <section id="media" className="space-y-6">
          {/* Section Header with Line */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pb-3">
              Media
            </h2>
            <div className="border-b border-slate-200" />
          </div>

          {filteredMedia.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-semibold text-xs">
              No media articles found matching "{searchQuery}".
            </div>
          ) : (
            <>
              {/* 3 Columns Grid of 6 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
                {filteredMedia.slice(0, mediaLimit).map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setActiveArticle(card)}
                    className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer p-3 sm:p-3.5"
                  >
                    {/* Image Container with Yellow Badge */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Pill Badge matching Figma */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs">
                        {card.tag}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="pt-3.5 pb-1 flex flex-col flex-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {card.type} • {card.readTime}
                      </p>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Button */}
              {mediaLimit < filteredMedia.length && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setMediaLimit((prev) => prev + 6)}
                    className="h-9 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 border border-amber-400"
                  >
                    See more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ========================================================= */}
        {/* 3. VIDEOS SECTION                                         */}
        {/* ========================================================= */}
        <section id="videos" className="space-y-6">
          {/* Section Header with Line */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pb-3">
              Videos
            </h2>
            <div className="border-b border-slate-200" />
          </div>

          {filteredVideos.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-semibold text-xs">
              No videos found matching your filters.
            </div>
          ) : (
            <>
              {/* 2 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
                {filteredVideos.slice(0, videoLimit).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer p-3.5 sm:p-4"
                  >
                    {/* Video Player Style Thumbnail */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                      {/* Geometric backdrop */}
                      <div className="absolute inset-0 bg-radial from-slate-900 via-slate-950 to-black opacity-95" />
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff0055_1px,transparent_1px)] [background-size:16px_16px]" />

                      {/* Pill Badge matching Figma */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs z-10">
                        {video.tag}
                      </span>

                      {/* Glossy Red Play Button Icon Matching Figma */}
                      <div className="relative z-10 w-16 h-12 rounded-2xl bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-400/40 group-hover:scale-110 group-hover:shadow-red-600/60 transition-all duration-300">
                        <div className="size-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white ml-1 drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pt-4 pb-1 flex flex-col flex-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {video.type} • {video.watchTime}
                      </p>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Button */}
              {videoLimit < filteredVideos.length && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setVideoLimit((prev) => prev + 2)}
                    className="h-9 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 border border-amber-400"
                  >
                    See more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ========================================================= */}
        {/* 4. PODCASTS SECTION (Screenshot 2)                        */}
        {/* ========================================================= */}
        <section id="podcasts" className="space-y-6">
          {/* Section Header with Line */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pb-3">
              Podcasts
            </h2>
            <div className="border-b border-slate-200" />
          </div>

          {filteredPodcasts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-semibold text-xs">
              No podcasts found matching your filters.
            </div>
          ) : (
            <>
              {/* 2 Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
                {filteredPodcasts.slice(0, podcastLimit).map((podcast) => (
                  <div
                    key={podcast.id}
                    onClick={() => setActivePodcast(podcast)}
                    className="group flex flex-col rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer p-3.5 sm:p-4"
                  >
                    {/* Studio Podcast Recording Thumbnail */}
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Pill Badge matching Figma */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold shadow-xs z-10">
                        {podcast.tag}
                      </span>

                      {/* Headphone Audio Badge Bottom Right */}
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Headphones className="size-3 text-amber-400" />
                        <span>{podcast.audioDuration}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="pt-4 pb-1 flex flex-col flex-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {podcast.type} • {podcast.listenTime}
                      </p>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-amber-800 transition-colors">
                        {podcast.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                        {podcast.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* See More Button */}
              {podcastLimit < filteredPodcasts.length && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setPodcastLimit((prev) => prev + 2)}
                    className="h-9 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105 border border-amber-400"
                  >
                    See more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

      </div>

      {/* ========================================================= */}
      {/* 5. MODALS & PREVIEWS                                      */}
      {/* ========================================================= */}

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="overflow-y-auto space-y-4 pr-1">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-xs font-bold">
                {activeArticle.tag}
              </span>
              <p className="text-xs font-semibold text-slate-400">
                {activeArticle.type} • {activeArticle.readTime}
              </p>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden my-4">
                <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line font-normal">
                {activeArticle.content}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Durrmi Clinical Library</span>
              <Button asChild size="sm" className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs">
                <Link to="/doctors">Talk to a Therapist</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
            >
              <X className="size-4" />
            </button>
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black shadow-lg">
              <iframe
                src={`${activeVideo.videoUrl}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="pt-4 text-left">
              <span className="px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[10px] font-bold">
                {activeVideo.tag}
              </span>
              <h3 className="text-lg font-black text-white mt-2">{activeVideo.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Podcast Audio Preview Modal */}
      {activePodcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActivePodcast(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="size-4" />
            </button>
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4">
              <img src={activePodcast.imageUrl} alt={activePodcast.title} className="w-full h-full object-cover" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FFE27D] text-slate-950 text-[11px] font-bold">
              {activePodcast.tag}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">{activePodcast.title}</h3>
            <p className="text-xs text-slate-600 mt-1.5">{activePodcast.description}</p>
            
            {/* Audio Waveform / Simulated Audio Bar */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="size-3.5 text-amber-600 animate-pulse" /> Playing Episode
                </span>
                <span>{activePodcast.audioDuration}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-amber-200 overflow-hidden">
                <div className="w-1/3 h-full bg-[#FFBE0B] rounded-full" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setActivePodcast(null)} variant="outline" size="sm" className="rounded-full text-xs">
                Close
              </Button>
              <Button asChild size="sm" className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs">
                <Link to="/doctors">Book Related Session</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
