import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  Loader2,
  Send,
  X,
  Move,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  HeartHandshake,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toDisplayMessage } from "@/lib/api/client";
import type { ApiError, AssistantReply, PreChatIntakeData } from "@/lib/api/types";
import { ASSISTANT_DISCLAIMER, assistantService } from "@/services/assistant.service";
import { PreChatIntakeModal } from "@/components/assistant/PreChatIntakeModal";
import { SuggestedQuestionChips } from "@/components/assistant/SuggestedQuestionChips";
import { TherapistRecommendationCard } from "@/components/assistant/TherapistRecommendationCard";
import { cn } from "@/lib/utils";

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
  error?: ApiError;
}

const DEFAULT_SUGGESTIONS = [
  "🌿 How to manage anxiety & overthinking?",
  "💼 I am feeling exhausted & burned out from work",
  "📋 What is Durrmi's session cancellation & refund policy?",
  "👩‍⚕️ How much does a therapy consultation cost?",
];

export function AssistantPanel() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);
  const [intakeData, setIntakeData] = useState<PreChatIntakeData | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag State for Floating Widget & Chat Panel (Movable on Screen)
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panelPos, setPanelPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const isDraggingBtn = useRef(false);
  const dragStartBtn = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedBtn = useRef(false);

  const isDraggingPanel = useRef(false);
  const dragStartPanel = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, []);

  const isDesktop = isClient && typeof window !== "undefined" && window.innerWidth >= 640;

  // Pointer Event Handlers for Launcher Button (Movable)
  const handleBtnPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    isDraggingBtn.current = true;
    hasDraggedBtn.current = false;
    dragStartBtn.current = { x: e.clientX - btnPos.x, y: e.clientY - btnPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleBtnPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingBtn.current) return;
    const deltaX = e.clientX - dragStartBtn.current.x;
    const deltaY = e.clientY - dragStartBtn.current.y;
    if (Math.abs(deltaX - btnPos.x) > 3 || Math.abs(deltaY - btnPos.y) > 3) {
      hasDraggedBtn.current = true;
    }
    setBtnPos({ x: deltaX, y: deltaY });
  };

  const handleBtnPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingBtn.current) return;
    isDraggingBtn.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Pointer Event Handlers for Panel Header (Movable Panel)
  const handlePanelPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    isDraggingPanel.current = true;
    dragStartPanel.current = { x: e.clientX - panelPos.x, y: e.clientY - panelPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePanelPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingPanel.current) return;
    const deltaX = e.clientX - dragStartPanel.current.x;
    const deltaY = e.clientY - dragStartPanel.current.y;
    setPanelPos({ x: deltaX, y: deltaY });
  };

  const handlePanelPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingPanel.current) return;
    isDraggingPanel.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Open Chat Launcher Trigger
  const handleOpenClick = () => {
    if (hasDraggedBtn.current) {
      hasDraggedBtn.current = false;
      return;
    }

    if (!intakeData && messages.length === 0) {
      setIntakeModalOpen(true);
    } else {
      setOpen(true);
    }
  };

  // Handle Intake Form Submission
  const handleIntakeSubmit = (data: PreChatIntakeData) => {
    setIntakeData(data);
    setIntakeModalOpen(false);
    setOpen(true);

    if (data.topic) {
      // Initialize with empathetic greeting tailored to user's picked topic
      const topicMsg = `I want to discuss ${data.topic}.`;
      handleSendMessage(topicMsg, data);
    }
  };

  // Handle Intake Form Skip
  const handleIntakeSkip = () => {
    setIntakeData({ skipped: true });
    setIntakeModalOpen(false);
    setOpen(true);
  };

  // Send Message Logic
  const handleSendMessage = async (textToSend?: string, overrideIntake?: PreChatIntakeData) => {
    const messageText = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageText || pending) return;

    const currentIntake = overrideIntake || intakeData;
    const userMsg: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === undefined) setInput("");
    setPending(true);

    try {
      const reply = await assistantService.chat(messageText, {
        topic: currentIntake?.topic,
        budgetTier: currentIntake?.budgetTier,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: reply.answer,
          reply,
        },
      ]);
    } catch (err: any) {
      const error: ApiError = err?.status
        ? err
        : {
            status: 500,
            code: "SERVER",
            message: toDisplayMessage(err),
          };

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: error.message || "Failed to reach assistant.",
          error,
        },
      ]);
      toast.error(error.message || "Could not reach Durrmi Assistant.");
    } finally {
      setPending(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setIntakeData(null);
    setIntakeModalOpen(true);
  };

  return (
    <>
      {/* 1. Pre-Chat Intake Modal */}
      <PreChatIntakeModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
        onSubmit={handleIntakeSubmit}
        onSkip={handleIntakeSkip}
      />

      {/* 2. Floating Movable Launcher Button */}
      {!open && (
        <div
          style={{
            transform: isDesktop ? `translate(${btnPos.x}px, ${btnPos.y}px)` : undefined,
            touchAction: "none",
          }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            type="button"
            onPointerDown={handleBtnPointerDown}
            onPointerMove={handleBtnPointerMove}
            onPointerUp={handleBtnPointerUp}
            onClick={handleOpenClick}
            aria-label="Open Durrmi AI Assistant"
            className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full shadow-xl shadow-emerald-700/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing border border-white/20 select-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur-xs text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-700" />
            </div>
            <div className="text-left pr-1">
              <p className="text-xs font-semibold tracking-tight text-white leading-tight">
                Durrmi AI Assistant
              </p>
              <p className="text-[10px] text-emerald-100/90 font-medium">Find your way within</p>
            </div>
          </button>
        </div>
      )}

      {/* 3. Movable Durrmi AI Assistant Chat Panel */}
      {open && (
        <div
          style={{
            transform: isDesktop ? `translate(${panelPos.x}px, ${panelPos.y}px)` : undefined,
            touchAction: "none",
          }}
          className={cn(
            "fixed z-50 flex flex-col bg-white dark:bg-card border border-emerald-100 dark:border-emerald-950/80 shadow-2xl rounded-3xl overflow-hidden transition-shadow duration-200",
            // Desktop dimensions
            "sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px]",
            // Mobile full screen
            "inset-0 sm:inset-auto"
          )}
        >
          {/* Header - Movable by Dragging */}
          <div
            onPointerDown={handlePanelPointerDown}
            onPointerMove={handlePanelPointerMove}
            onPointerUp={handlePanelPointerUp}
            className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white select-none cursor-grab active:cursor-grabbing border-b border-emerald-700/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold tracking-tight truncate">Durrmi AI Assistant</h3>
                  <span className="text-[9px] font-semibold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded-full text-emerald-50">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 truncate flex items-center gap-1">
                  <span>Power of connecting yourself</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reset / Change Topic */}
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset or Change Topic"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Drag Handle Indicator */}
              <div
                className="hidden sm:flex p-1.5 text-emerald-200 hover:text-white cursor-grab active:cursor-grabbing"
                title="Drag to reposition panel"
              >
                <Move className="w-4 h-4" />
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Intake Banner (if topic selected) */}
          {intakeData?.topic && (
            <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-200">
              <span className="font-medium truncate">
                Focused Topic: <span className="font-semibold">{intakeData.topic}</span>
              </span>
              <button
                onClick={() => setIntakeModalOpen(true)}
                className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold ml-2 flex-shrink-0"
              >
                Change
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-emerald-50/20 to-background dark:via-emerald-950/10 text-sm"
          >
            {/* Welcome message if no chat history */}
            {messages.length === 0 && (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-foreground">Welcome to Durrmi</h4>
                  <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                    "At Durrmi, we don't believe in fixing you — because you're not broken. We believe in presence."
                  </p>
                </div>

                <div className="pt-2 text-left space-y-1.5">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                    Try asking:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {DEFAULT_SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(s)}
                        className="text-left text-xs bg-white dark:bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-foreground border border-border/70 hover:border-emerald-300 rounded-xl px-3 py-2 transition-colors shadow-2xs"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((m) => {
              const isUser = m.role === "user";

              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col max-w-[88%] animate-in fade-in slide-in-from-bottom-2 duration-200",
                    isUser ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs",
                      isUser
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs font-normal"
                        : "bg-white dark:bg-card text-foreground border border-emerald-100/80 dark:border-emerald-900/40 rounded-bl-xs"
                    )}
                  >
                    {m.text}

                    {/* Sources Badge if RAG grounded */}
                    {!isUser && m.reply?.sources && m.reply.sources.length > 0 && !m.reply.isSecurityBlocked && (
                      <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span className="font-medium">
                          Grounded in {m.reply.sources[0].title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Therapist Recommendation Card if matched */}
                  {!isUser && m.reply?.doctorMatch && (
                    <div className="w-full">
                      <TherapistRecommendationCard
                        doctorMatch={m.reply.doctorMatch}
                        matchedSpecialty={m.reply.matchedSpecialty}
                        maxBudget={
                          intakeData?.budgetTier === "under_1000"
                            ? 1000
                            : intakeData?.budgetTier === "1000_to_2000"
                            ? 2000
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {/* 3 Clickable Suggested Question Chips */}
                  {!isUser && m.reply?.suggestedQuestions && (
                    <SuggestedQuestionChips
                      questions={m.reply.suggestedQuestions}
                      onSelect={(q) => handleSendMessage(q)}
                      disabled={pending}
                    />
                  )}
                </div>
              );
            })}

            {/* Pending typing indicator */}
            {pending && (
              <div className="mr-auto flex items-center gap-2 bg-white dark:bg-card border border-emerald-100 dark:border-emerald-900/40 px-3.5 py-2 rounded-2xl rounded-bl-xs text-xs text-muted-foreground shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Durrmi Assistant is thinking...</span>
              </div>
            )}
          </div>

          {/* Footer Disclaimer & Input Bar */}
          <div className="p-3 bg-white dark:bg-card border-t border-border/60 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Share what's on your mind or ask about therapy..."
                rows={1}
                className="min-h-[42px] max-h-[90px] resize-none text-xs sm:text-sm rounded-xl border-border/70 focus-visible:ring-emerald-500 bg-background/50"
              />
              <Button
                type="submit"
                disabled={!input.trim() || pending}
                className="h-[42px] px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-xs disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-[10px] text-center text-muted-foreground/80 leading-tight">
              Durrmi Companion provides emotional support and therapy guidance. Not for emergency medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
