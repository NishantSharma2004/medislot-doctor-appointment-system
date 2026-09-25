import { createFileRoute } from "@tanstack/react-router";
import { BlogDetailPage } from "./blogs.$blogId.index";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "True abundance is inner calm. — Durrmi Blog" },
      {
        name: "description",
        content:
          "We spend so much of our lives with others, with friends, family, colleagues, and strangers online. Because of all this, we always forget to look for ourselves. True abundance is inner calm.",
      },
    ],
  }),
  component: BlogDetailPage,
});
