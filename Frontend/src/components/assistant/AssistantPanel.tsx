import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  Loader2,
  Send,
  X,
  Move,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  HeartHandshake,
  Check,
  ArrowRight,
  ChevronLeft,
  Plus,
  Minus,
  Paperclip,
  Mic,
  MicOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toDisplayMessage } from "@/lib/api/client";
import type { ApiError, AssistantReply, PreChatIntakeData } from "@/lib/api/types";
import { ASSISTANT_DISCLAIMER, assistantService, SPECIALTY_REGISTRY, isHindiOrHinglish } from "@/services/assistant.service";
import { SuggestedQuestionChips } from "@/components/assistant/SuggestedQuestionChips";
import { TherapistRecommendationCard } from "@/components/assistant/TherapistRecommendationCard";
import { LabReportAnalyzerModal } from "@/components/assistant/LabReportAnalyzerModal";
import { DurrmiLogoIcon } from "@/components/common/DurrmiLogo";
import { cn } from "@/lib/utils";

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  reply?: AssistantReply;
  error?: ApiError;
}

const TOPICS = [
  { id: "Stress & Burnout", label: "Stress & Burnout", icon: "💼" },
  { id: "Anxiety", label: "Anxiety & Overthinking", icon: "⚡" },
  { id: "Relationships", label: "Couple & Relationships", icon: "🌱" },
  { id: "Sleep", label: "Sleep & Insomnia", icon: "🌙" },
  { id: "Depression and low mood", label: "Low Mood & Sadness", icon: "🌧️" },
  { id: "Career", label: "Career & Work Pressure", icon: "🎯" },
  { id: "ADHD", label: "ADHD & Attention", icon: "🧠" },
  { id: "Loneliness", label: "Loneliness & Isolation", icon: "🌿" },
  { id: "Other", label: "Other / Not Listed", icon: "✨" },
];

const BUDGETS: Array<{ id: "under_1000" | "1000_to_2000" | "any"; label: string; desc: string }> = [
  { id: "under_1000", label: "Under ₹1,000", desc: "Budget Friendly" },
  { id: "1000_to_2000", label: "₹1,000 - ₹2,000", desc: "Most Popular" },
  { id: "any", label: "Any Budget", desc: "View all Specialists" },
];

const DEFAULT_SUGGESTIONS = [
  "🌿 How to manage anxiety & overthinking?",
  "💼 I am feeling exhausted & burned out from work",
  "📋 What is Durrmi's session cancellation & refund policy?",
  "👩‍⚕️ How much does a therapy consultation cost?",
];

function renderCleanMessage(rawText: string) {
  if (!rawText) return null;

  // 1. Strip raw markdown tables, question self-check matrices, and horizontal rules
  const cleaned = rawText
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      // Remove table rows like | Question | Response | or |---|
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) return false;
      // Remove horizontal dividers like --- or ***
      if (/^[-*_]{3,}$/.test(trimmed)) return false;
      return true;
    })
    .join("\n")
    // Clean markdown header hashes: "### Heading" -> "Heading"
    .replace(/^#{1,6}\s+/gm, "")
    // Compress consecutive blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // 2. Parse inline **bold text** into <strong> elements safely
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={index} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function AssistantPanel() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"intake" | "chat">("intake");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<"under_1000" | "1000_to_2000" | "any">("any");
  const [intakeData, setIntakeData] = useState<PreChatIntakeData | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastUserMessageIdRef = useRef<string | null>(null);

  // Voice Input (Speech Recognition) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const conversationIdRef = useRef<string>(crypto.randomUUID());

  // File Upload & Lab Report Analyzer Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | undefined>(undefined);
  const [attachedReportText, setAttachedReportText] = useState<string | undefined>(undefined);

  // Drag State for Floating Widget & Chat Panel (Shared Movement)
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStartPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && view === "chat") {
      textareaRef.current?.focus();
    }
  }, [open, view]);

  // Maintain viewport at the start of the current question/reply turn so users can read from top down
  useEffect(() => {
    if (view !== "chat" || !scrollRef.current) return;

    if (lastUserMessageIdRef.current) {
      const scrollContainer = scrollRef.current;
      const targetId = lastUserMessageIdRef.current;

      const scrollToTurnTop = () => {
        if (!scrollContainer) return;
        const userMsgEl = scrollContainer.querySelector(`[data-msg-id="${targetId}"]`) as HTMLElement | null;
        if (userMsgEl) {
          const targetTop = Math.max(0, userMsgEl.offsetTop - 12);
          scrollContainer.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      };

      const timer = setTimeout(scrollToTurnTop, 30);
      return () => clearTimeout(timer);
    } else if (messages.length === 0) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [messages, pending, view]);

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

  // Unified Pointer Drag Handlers (Both Launcher Button & Chat Panel Header/Handle)
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return; // Mobile stays docked

    const target = e.target as HTMLElement;
    // Don't drag if interacting with inputs, textareas, or links
    if (target.closest("input") || target.closest("textarea") || target.closest("a")) {
      return;
    }

    const clickedButton = target.closest("button");
    // If a button was clicked:
    // Allow drag if it is the floating launcher button or an explicit drag handle button.
    // Prevent drag if it is an action button (close X, reset, back, submit, topic select).
    if (clickedButton) {
      const isLauncher = clickedButton.id === "durrmi-launcher-btn" || e.currentTarget.id === "durrmi-launcher-btn";
      const isDragHandle = clickedButton.dataset.dragHandle === "true";
      if (!isLauncher && !isDragHandle) {
        return;
      }
    }

    isDragging.current = true;
    hasDragged.current = false;
    dragStartPoint.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = { x: e.clientX - btnPos.x, y: e.clientY - btnPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging.current) return;
    const distanceMoved = Math.hypot(
      e.clientX - dragStartPoint.current.x,
      e.clientY - dragStartPoint.current.y
    );
    if (distanceMoved > 6) {
      hasDragged.current = true;
    }
    const nextX = e.clientX - dragStartOffset.current.x;
    const nextY = e.clientY - dragStartOffset.current.y;
    setBtnPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Voice Recognition (Speech-to-Text) Toggle
  const toggleVoiceRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... Speak your message");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          toast.error(
            "Microphone permission not applied to this tab. Please refresh the page (Ctrl + R / F5) to activate the microphone."
          );
        } else if (event.error === "no-speech") {
          // User stayed silent, no error toast needed
        } else if (event.error === "audio-capture") {
          toast.error("No microphone hardware detected or your mic is muted in Windows.");
        } else if (event.error === "network") {
          toast.error("Network issue connecting to browser speech recognition.");
        } else if (event.error !== "aborted") {
          toast.error("Voice input error: " + event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      toast.error("Could not activate voice input. Please refresh the page (Ctrl+R).");
    }
  };

  // File Upload Handler (Lab Report / Prescription / Health Document)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);

    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAttachedReportText(text || "");
        setReportModalOpen(true);
      };
      reader.readAsText(file);
    } else {
      setAttachedReportText(
        `Report File: ${file.name} (${Math.round(file.size / 1024)} KB). Ready for Medical AI analysis.`
      );
      setReportModalOpen(true);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle Chat Open/Close on Click
  const handleBtnClick = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return; // Ignore click if user was dragging
    }
    setOpen((prev) => !prev);
  };

  // 1. User Clicks "Start Conversation" from Intake Screen
  const handleStartConversation = (topicOverride?: unknown) => {
    const explicitTopic = typeof topicOverride === "string" ? topicOverride : undefined;
    let finalTopic = explicitTopic || (typeof selectedTopic === "string" ? selectedTopic : undefined);
    if (finalTopic === "Other") {
      finalTopic = customTopic.trim() ? customTopic.trim() : "Personal Well-being";
    }

    const safeTopic = typeof finalTopic === "string" && finalTopic.trim() ? finalTopic.trim() : undefined;

    const data: PreChatIntakeData = {
      topic: safeTopic,
      budgetTier: selectedBudget,
      skipped: false,
    };

    conversationIdRef.current = crypto.randomUUID();
    lastUserMessageIdRef.current = null;
    // ALWAYS reset messages when starting/changing topic so fresh chat starts
    setMessages([]);
    setInput("");
    setIntakeData(data);
    setView("chat");

    if (safeTopic) {
      handleSendMessage(`I want to discuss ${safeTopic}.`, data);
    }
  };

  // 2. User Clicks "Skip and start chatting directly"
  const handleSkipIntake = () => {
    const data: PreChatIntakeData = {
      skipped: true,
      budgetTier: selectedBudget,
    };
    conversationIdRef.current = crypto.randomUUID();
    lastUserMessageIdRef.current = null;
    setMessages([]);
    setInput("");
    setIntakeData(data);
    setView("chat");
  };

  // Send Message Logic
  const handleSendMessage = async (textToSend?: unknown, overrideIntake?: PreChatIntakeData) => {
    const explicitText = typeof textToSend === "string" ? textToSend : undefined;
    const messageText = (explicitText !== undefined ? explicitText : input).trim();
    if (!messageText || pending) return;

    const safeOverrideTopic =
      overrideIntake && typeof overrideIntake.topic === "string" ? overrideIntake.topic : undefined;
    const safeSelectedTopic = typeof selectedTopic === "string" ? selectedTopic : undefined;

    const currentIntake: PreChatIntakeData = overrideIntake || intakeData || {
      topic: safeOverrideTopic || safeSelectedTopic,
      budgetTier: selectedBudget,
      skipped: false,
    };

    if (!intakeData) {
      setIntakeData(currentIntake);
    }

    const userMsg: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText,
    };

    lastUserMessageIdRef.current = userMsg.id;
    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === undefined) setInput("");
    setPending(true);

    try {
      const reply = await assistantService.chat(messageText, {
        conversationId: conversationIdRef.current,
        topic: currentIntake?.topic,
        budgetTier: currentIntake?.budgetTier,
        previousMessages: messages.map((m) => ({ role: m.role, text: m.text })),
      });

      // Keep active topic in sync if user switched clinical domain dynamically
      if (reply.matchedSpecialty && reply.matchedSpecialty !== currentIntake?.topic) {
        setIntakeData((prev) =>
          prev
            ? { ...prev, topic: reply.matchedSpecialty }
            : { topic: reply.matchedSpecialty, budgetTier: selectedBudget, skipped: false }
        );
      }

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
    conversationIdRef.current = crypto.randomUUID();
    lastUserMessageIdRef.current = null;
    setMessages([]);
    setIntakeData(null);
    setSelectedTopic(null);
    setCustomTopic("");
    setInput("");
    setView("intake");
    toast.success("Ready for a fresh conversation.");
  };

  return (
    <>
      {/* 1. Floating Movable Launcher Button (Always visible at bottom-right of viewport) */}
      <button
        id="durrmi-launcher-btn"
        type="button"
        onClick={handleBtnClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={isDesktop ? { transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)` } : undefined}
        aria-label={open ? "Close Durrmi AI Assistant" : "Open Durrmi AI Assistant"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full shadow-2xl shadow-emerald-950/30 transition-transform duration-75 select-none touch-none sm:cursor-grab active:sm:cursor-grabbing hover:scale-105 active:scale-95 border border-white/25 pointer-events-auto"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs text-white">
          {open ? (
            <X className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <>
              <DurrmiLogoIcon className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-700" />
            </>
          )}
        </div>
        <div className="text-left pr-1">
          <p className="text-xs font-semibold tracking-tight text-white leading-tight">
            Durrmi AI Assistant
          </p>
          <p className="text-[10px] text-emerald-100/90 font-medium">
            {open ? "Click to minimize" : "Find your way within"}
          </p>
        </div>
      </button>

      {/* 2. Side-Docked Movable Durrmi AI Assistant Chat Panel */}
      {open && (
        <aside
          id="durrmi-assistant-panel"
          aria-label="Durrmi AI Assistant"
          style={isDesktop ? { transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)` } : undefined}
          className="fixed bottom-24 right-6 z-50 flex h-[36rem] w-[min(26rem,calc(100vw-2rem))] flex-col rounded-3xl border border-emerald-200/90 dark:border-emerald-800/60 bg-white dark:bg-card shadow-2xl overflow-hidden pointer-events-auto transition-transform duration-75"
        >
          {/* ========================================================================= */}
          {/* VIEW 1: PRE-CHAT INTAKE SCREEN (Exactly like Screenshot 1, in side panel) */}
          {/* ========================================================================= */}
          {view === "intake" ? (
            <div className="flex flex-col h-full bg-white dark:bg-card overflow-hidden">
              {/* Green Header - Draggable */}
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 pt-5 pb-4 text-white relative select-none touch-none sm:cursor-grab active:sm:cursor-grabbing border-b border-emerald-700/40"
              >
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  {/* Drag Handle to Move Panel */}
                  <button
                    type="button"
                    data-drag-handle="true"
                    className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 cursor-grab active:cursor-grabbing transition-colors"
                    title="Drag to move panel"
                    aria-label="Drag to move panel"
                  >
                    <Move className="w-4 h-4 pointer-events-none" />
                  </button>

                  {/* Minimize Button (-) */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Minimize"
                    aria-label="Minimize"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  {/* Close / Exit Button (X) */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-medium text-emerald-50 mb-2">
                  <DurrmiLogoIcon className="w-3.5 h-3.5 text-white" />
                  <span>Durrmi AI Companion</span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight leading-snug">
                  How can we support you today?
                </h3>
                <p className="text-xs text-emerald-100/90 mt-1 leading-normal">
                  Pick a topic to help our AI personalize guidance and match therapists faster.
                </p>
              </div>

              {/* Scrollable Body: Topic Cards & Budget */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* 1. What's on your mind? */}
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    1. What's on your mind?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TOPICS.map((t) => {
                      const isSelected = selectedTopic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTopic(isSelected ? null : t.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold shadow-xs"
                              : "border-border/70 hover:border-emerald-400 bg-background/50 hover:bg-muted/40 text-foreground"
                          )}
                        >
                          <span className="text-base select-none">{t.icon}</span>
                          <span className="truncate">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* If Other is selected, show optional custom topic text input */}
                  {selectedTopic === "Other" && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 animate-in fade-in slide-in-from-top-1 duration-150">
                      <label className="text-[11px] font-semibold text-emerald-950 dark:text-emerald-200 block mb-1">
                        Tell us what you'd like to discuss (Optional):
                      </label>
                      <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder="e.g., Grief, Trauma, Family stress, Confidence, General health..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-card focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-foreground"
                        autoFocus
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Feel free to type your concern or click Start Conversation to chat openly.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Preferred Budget */}
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    2. Preferred Consultation Budget
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {BUDGETS.map((b) => {
                      const isSelected = selectedBudget === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBudget(b.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all",
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold shadow-xs"
                              : "border-border/70 hover:border-emerald-400 bg-background/50 text-foreground"
                          )}
                        >
                          <span className="text-xs font-semibold">{b.label}</span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">{b.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-emerald-50/60 dark:bg-emerald-950/30 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Confidential & Private. You are in control of your journey.</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={() => handleStartConversation()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-2.5 text-xs font-medium shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Start Conversation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleSkipIntake()}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 font-medium transition-colors cursor-pointer"
                  >
                    Skip and start chatting directly →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: ACTIVE CONVERSATIONAL CHAT SCREEN (Empathetic + Suggestions)      */
            /* ========================================================================= */
            <div className="flex flex-col h-full bg-white dark:bg-card overflow-hidden">
              {/* Chat Header - Movable by Dragging */}
              <header
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white select-none touch-none sm:cursor-grab active:sm:cursor-grabbing border-b border-emerald-700/40"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setView("intake")}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Back to Topics"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs flex-shrink-0">
                    <DurrmiLogoIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-semibold tracking-tight truncate">Durrmi AI Assistant</h3>
                      <span className="text-[9px] font-semibold uppercase tracking-wider bg-white/20 px-1.5 py-0.2 rounded-full text-emerald-50">
                        Live
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-100/90 truncate">Power of connecting yourself</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Explicit New Chat Button */}
                  <button
                    type="button"
                    onClick={handleResetChat}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Start a Fresh Chat"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Chat</span>
                  </button>

                  {/* Drag Handle on Desktop - Draggable via Button and via Header */}
                  <button
                    type="button"
                    data-drag-handle="true"
                    className="hidden sm:flex p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 cursor-grab active:cursor-grabbing transition-colors"
                    title="Drag to reposition panel"
                    aria-label="Drag to reposition"
                  >
                    <Move className="w-3.5 h-3.5 pointer-events-none" />
                  </button>

                  {/* Minimize Button (-) */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Minimize"
                    aria-label="Minimize"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Close"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Active Topic Banner */}
              {intakeData?.topic && typeof intakeData.topic === "string" && (
                <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-200">
                  <span className="font-medium truncate">
                    Focused on: <span className="font-semibold">{intakeData.topic}</span>
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={() => setView("intake")}
                      className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      Change Topic
                    </button>
                    <span className="text-emerald-300 dark:text-emerald-700">•</span>
                    <button
                      onClick={() => handleResetChat()}
                      className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      New Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Scroll Area */}
              <div
                ref={scrollRef}
                className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background via-emerald-50/20 to-background dark:via-emerald-950/10 text-xs sm:text-sm"
              >
                {/* Initial Welcome message if user skipped intake */}
                {messages.length === 0 && (
                  <div className="py-3 text-center space-y-3 animate-in fade-in duration-200">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center shadow-xs">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">Welcome to Durrmi</h4>
                      <p className="text-xs text-muted-foreground max-w-[260px] mx-auto leading-relaxed italic">
                        "At Durrmi, we don't believe in fixing you — because you're not broken. We believe in presence."
                      </p>
                    </div>

                    <div className="pt-2 text-left space-y-1.5">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                        Try asking directly:
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {DEFAULT_SUGGESTIONS.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(s)}
                            className="text-left text-xs bg-white dark:bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-foreground border border-border/70 hover:border-emerald-300 rounded-xl px-3 py-2 transition-colors shadow-2xs cursor-pointer"
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
                  const messageText = typeof m.text === "string" ? m.text : String(m.text || "");

                  return (
                    <div
                      key={m.id}
                      data-msg-id={m.id}
                      className={cn(
                        "flex flex-col max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-200",
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
                        {renderCleanMessage(messageText)}

                        {/* RAG Source Citation Badge */}
                        {!isUser && m.reply?.sources && m.reply.sources.length > 0 && !m.reply.isSecurityBlocked && (
                          <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span className="font-medium">
                              Grounded in {m.reply.sources[0].title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Matched Therapist Recommendation Card */}
                      {!isUser && m.reply?.doctorMatch && (
                        <div className="w-full">
                          <TherapistRecommendationCard
                            doctorMatch={m.reply.doctorMatch}
                            matchedSpecialty={m.reply.matchedSpecialty}
                            maxBudget={
                              selectedBudget === "under_1000"
                                ? 1000
                                : selectedBudget === "1000_to_2000"
                                ? 2000
                                : undefined
                            }
                          />
                        </div>
                      )}

                      {/* 3 Clickable Suggested Question Chips */}
                      {!isUser && (
                        <SuggestedQuestionChips
                          questions={
                            m.reply?.suggestedQuestions && m.reply.suggestedQuestions.length > 0
                              ? m.reply.suggestedQuestions
                              : intakeData?.topic && typeof intakeData.topic === "string" && SPECIALTY_REGISTRY[intakeData.topic]
                              ? (isHindiOrHinglish(messageText)
                                  ? SPECIALTY_REGISTRY[intakeData.topic].hi.suggestedQuestions
                                  : SPECIALTY_REGISTRY[intakeData.topic].en.suggestedQuestions)
                              : DEFAULT_SUGGESTIONS
                          }
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

              {/* Footer Input Bar */}
              <footer className="p-3 bg-white dark:bg-card border-t border-border/60 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-1.5"
                >
                  {/* File Upload Button (Paperclip) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,image/*,.txt,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      } else {
                        setReportModalOpen(true);
                      }
                    }}
                    className="p-2 rounded-xl text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex-shrink-0 cursor-pointer"
                    title="Upload & Analyze Lab/Medical Report"
                    aria-label="Upload Report"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Mic Voice Input Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={cn(
                      "p-2 rounded-xl transition-all flex-shrink-0 cursor-pointer",
                      isListening
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse ring-2 ring-rose-400"
                        : "text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    )}
                    title={isListening ? "Listening... Click to stop" : "Voice input (Speak to AI)"}
                    aria-label="Voice input"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

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
                    placeholder={
                      isListening
                        ? "Listening... Speak your message"
                        : "Share what's on your mind or ask about therapy..."
                    }
                    rows={1}
                    className={cn(
                      "min-h-[40px] max-h-[85px] resize-none text-xs rounded-xl border-border/70 focus-visible:ring-emerald-500 bg-background/50",
                      isListening && "border-rose-400 ring-1 ring-rose-400 placeholder:text-rose-500"
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || pending}
                    className="h-[40px] px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-xs disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>

                <p className="text-[10px] text-center text-muted-foreground/80 leading-tight">
                  Durrmi Companion provides emotional support and therapy guidance. Not for emergency medical advice.
                </p>
              </footer>
            </div>
          )}
        </aside>
      )}

      {/* Lab Report & Medical Document Analyzer Modal */}
      <LabReportAnalyzerModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        initialFileName={attachedFileName}
        initialReportText={attachedReportText}
      />
    </>
  );
}
