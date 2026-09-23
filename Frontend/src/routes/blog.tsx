import { createFileRoute } from "@tanstack/react-router";
import { BlogDetailPage } from "./blogs.$blogId.index";

export const Route = createFileRoute("/blog")({
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
