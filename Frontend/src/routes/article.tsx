import { createFileRoute } from "@tanstack/react-router";
import { BlogDetailPage } from "./blogs.$blogId.index";

export const Route = createFileRoute("/article")({
  head: () => ({
    meta: [
      { title: "Story of Durrmi — Girish Kotian" },
      {
        name: "description",
        content:
          "Your mind isn’t a responsibility. It’s you—let us help you carry it. The Story of Durrmi by Girish Kotian, Founder of Durrmi.",
      },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  return <BlogDetailPage defaultPostId="story-of-durrmi" />;
}
