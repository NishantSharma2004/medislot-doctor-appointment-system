import { Bot, FileText, Loader2, Send, ShieldAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toDisplayMessage } from "@/lib/api/client";
import type { ApiError, AssistantReply, EvidenceStrength } from "@/lib/api/types";
import { ASSISTANT_DISCLAIMER, assistantService } from "@/services/assistant.service";
import { cn } from "@/lib/utils";

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
  error?: ApiError;
}

const EVIDENCE_STYLES: Record<EvidenceStrength, string> = {
  STRONG: "bg-success/15 text-success border-success/40",
  MODERATE: "bg-info/15 text-info border-info/40",
  LIMITED: "bg-warning/15 text-warning-foreground border-warning/40",
  NONE: "bg-muted text-muted-foreground border-border",
};

const SUGGESTIONS = [
  "How do I book an appointment?",
  "What is the cancellation policy?",
  "Which specialization should I choose?",
  "What are the clinic timings?",
];

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) textareaRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || pending) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: question }]);
    setPending(true);
    try {
      const reply = await assistantService.chat(question);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply.answer, reply },
      ]);
    } catch (caught) {
      const error = caught as ApiError;
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text:
            error.code === "RATE_LIMITED"
              ? toDisplayMessage(error)
              : "The assistant service is unavailable right now. Please try again in a moment — you can still browse doctors and manage appointments as usual.",
          error,
        },
      ]);
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        size="lg"
        className="fixed bottom-5 right-5 z-50 h-14 gap-2 rounded-full shadow-float"
        aria-expanded={open}
        aria-controls="assistant-panel"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Bot className="size-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{open ? "Close assistant" : "Ask the assistant"}</span>
      </Button>

      {open ? (
        <section
          id="assistant-panel"
          aria-label="Clinic assistant"
          className="surface-panel fixed bottom-24 right-4 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden p-0"
        >
          <header className="flex items-center gap-2 border-b border-border bg-primary-soft px-4 py-3">
            <Bot className="size-5 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">Clinic assistant</h2>
              <p className="truncate text-xs text-muted-foreground">Navigation & policy help</p>
            </div>
          </header>

          <div className="flex items-start gap-2 border-b border-border bg-warning/10 px-4 py-2 text-xs text-warning-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>{ASSISTANT_DISCLAIMER}</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try one of these:</p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="block w-full rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[92%] rounded-xl px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                  message.error && "border border-destructive/40 bg-destructive/5",
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>

                {message.reply && !message.reply.sufficientEvidence ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Insufficient evidence in the clinic's verified documents for a confident answer.
                  </p>
                ) : null}

                {message.reply?.sources.length ? (
                  <div className="mt-3 space-y-2 border-t border-border pt-2">
                    <p className="text-xs font-semibold text-muted-foreground">Sources</p>
                    {message.reply.sources.map((source) => (
                      <div key={`${source.title}-${source.section}`} className="flex items-start gap-2">
                        <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{source.title}</p>
                          {source.section ? (
                            <p className="truncate text-xs text-muted-foreground">{source.section}</p>
                          ) : null}
                          <Badge
                            variant="outline"
                            className={cn("mt-1 rounded-full text-[10px]", EVIDENCE_STYLES[source.evidenceStrength])}
                          >
                            Evidence: {source.evidenceStrength.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {pending ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Checking clinic documents…
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              Ask the clinic assistant
            </label>
            <div className="flex items-end gap-2">
              <Textarea
                id="assistant-input"
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about booking, policies or specializations"
                className="max-h-28 min-h-10 resize-none"
              />
              <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send message">
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
