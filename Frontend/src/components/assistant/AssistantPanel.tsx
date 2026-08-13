import { Link, useNavigate } from "@tanstack/react-router";
import { Bot, FileText, Loader2, Send, ShieldAlert, X, Move, LogIn, Sparkles, CalendarClock, Upload, Stethoscope, Paperclip, Trash2, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toDisplayMessage } from "@/lib/api/client";
import type { ApiError, AssistantReply, EvidenceStrength } from "@/lib/api/types";
import { ASSISTANT_DISCLAIMER, assistantService } from "@/services/assistant.service";
import { cn } from "@/lib/utils";

interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachedFileName?: string;
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
  "🩺 Check my symptoms (Chest pain & dizziness)",
  "📄 Analyze & translate blood test report",
  "How do I book an appointment?",
  "What are the clinic timings?",
];

export function AssistantPanel() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ name: string; content?: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag State for Floating Widget & Panel
  const [btnPos, setBtnPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingBtn = useRef(false);
  const dragStartBtn = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDragged = useRef(false);

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

  // Pointer Event Handlers for Launcher Button & Panel Header
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return; // Mobile stays docked
    isDraggingBtn.current = true;
    hasDragged.current = false;
    dragStartBtn.current = { x: e.clientX - btnPos.x, y: e.clientY - btnPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingBtn.current) return;
    const deltaX = e.clientX - dragStartBtn.current.x;
    const deltaY = e.clientY - dragStartBtn.current.y;
    if (Math.abs(deltaX - btnPos.x) > 3 || Math.abs(deltaY - btnPos.y) > 3) {
      hasDragged.current = true;
    }
    setBtnPos({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingBtn.current) return;
    isDraggingBtn.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleBtnClick = () => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return; // Ignore click if user was dragging
    }
    setOpen((v) => !v);
  };

  async function send(text: string) {
    const question = text.trim();
    const currentFile = attachedFile;
    if ((!question && !currentFile) || pending) return;
    if (!isAuthenticated) {
      setMessages((prev) => [
        ...prev,
        { id: `u-${Date.now()}`, role: "user", text: question || `Analyze ${currentFile?.name}`, attachedFileName: currentFile?.name },
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Authentication required: Please sign in to chat with Medi AI Assistant.",
          error: { status: 401, code: "UNAUTHORIZED", message: "Sign in required" },
        },
      ]);
      return;
    }

    setInput("");
    setAttachedFile(null);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: question || `Analyze uploaded lab report: ${currentFile?.name}`, attachedFileName: currentFile?.name },
    ]);
    setPending(true);
    try {
      const reply = await assistantService.chat(
        question || `Analyze uploaded lab report: ${currentFile?.name}`,
        currentFile || undefined,
      );
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
          text: error.status === 401
            ? "Authentication required: Please sign in to chat with Medi AI Assistant."
            : error.message || toDisplayMessage(error),
          error,
        },
      ]);
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  }

  function handleEditMessage(msgToEdit: AssistantMessage) {
    setInput(msgToEdit.text);
    const idx = messages.findIndex((m) => m.id === msgToEdit.id);
    if (idx !== -1) {
      setMessages((prev) => prev.slice(0, idx));
    }
    textareaRef.current?.focus();
    toast.info("Message loaded for editing");
  }

  return (
    <>
      {/* Draggable Circular Robot Launcher Button */}
      <button
        onClick={handleBtnClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        type="button"
        style={isDesktop ? { transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)` } : undefined}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-primary p-2.5 text-primary-foreground shadow-2xl transition-transform duration-75 select-none touch-none sm:cursor-grab active:sm:cursor-grabbing hover:scale-105 hover:shadow-primary/30 group"
        aria-expanded={open}
        aria-controls="assistant-panel"
        title="Medi AI Assistant (Drag to reposition)"
      >
        <div className="relative flex size-12 items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-inner">
          {open ? (
            <X className="size-6 transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="size-7 text-white animate-pulse" aria-hidden="true" />
              <Sparkles className="absolute -top-1 -right-1 size-3.5 text-amber-300 animate-spin" style={{ animationDuration: "4s" }} />
            </div>
          )}
        </div>
        <span className="hidden sm:inline pr-3 font-semibold text-sm tracking-wide">
          {open ? "Close" : "Medi AI Assistant"}
        </span>
      </button>

      {open ? (
        <section
          id="assistant-panel"
          aria-label="Medi AI Assistant"
          style={isDesktop ? { transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)` } : undefined}
          className="surface-panel fixed bottom-24 right-6 z-50 flex h-[34rem] w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden p-0 shadow-2xl transition-transform duration-75 rounded-2xl border border-primary/20 bg-background/95 backdrop-blur-md"
        >
          {/* Draggable Header */}
          <header
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="flex items-center gap-3 border-b border-border/80 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-4 py-3.5 select-none touch-none sm:cursor-grab active:sm:cursor-grabbing"
          >
            {/* Round Circular Robot Badge */}
            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary shadow-sm">
              <Bot className="size-5" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-sm font-bold tracking-tight text-foreground">Medi AI Assistant</h2>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider font-semibold">
                  AI
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">Smart clinic navigation & policies (Drag me)</p>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    toast.success("Chat history cleared");
                  }}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Clear chat history"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
              <Move className="hidden sm:block size-4 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity" aria-hidden="true" />
            </div>
          </header>

          <div className="flex items-start gap-2 border-b border-border/60 bg-amber-500/10 px-4 py-2 text-xs text-amber-900 dark:text-amber-300">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <p className="leading-tight">{ASSISTANT_DISCLAIMER}</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {!isAuthenticated ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-center space-y-2">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                  Authentication Required
                </p>
                <p className="text-xs text-muted-foreground">
                  Please sign in to ask questions to Medi AI Assistant.
                </p>
                <Button asChild size="sm" className="w-full gap-1.5 mt-1 font-medium">
                  <Link to="/login" search={{ redirect: "/doctors" }}>
                    <LogIn className="size-3.5" /> Sign in to start
                  </Link>
                </Button>
              </div>
            ) : null}

            {messages.length === 0 && isAuthenticated ? (
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-muted-foreground">Suggested questions:</p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="block w-full rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-left text-xs font-medium transition-all hover:bg-accent hover:border-primary/30 active:scale-[0.99]"
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
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-xs"
                    : "bg-muted/80 text-foreground rounded-bl-xs border border-border/40",
                  message.error && "border border-destructive/40 bg-destructive/5 text-destructive",
                )}
              >
                {message.role === "user" ? (
                  <div className="flex items-center justify-between gap-2 mb-1 border-b border-primary-foreground/20 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">You</span>
                    <button
                      type="button"
                      onClick={() => handleEditMessage(message)}
                      className="flex items-center gap-1 text-[10px] opacity-75 hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 px-1.5 py-0.5 rounded font-medium cursor-pointer"
                      title="Edit message (Fix typing mistake)"
                    >
                      <Pencil className="size-2.5" /> Edit
                    </button>
                  </div>
                ) : null}

                {message.attachedFileName ? (
                  <div className="mb-1 text-[10px] font-semibold text-emerald-300 dark:text-emerald-400 flex items-center gap-1">
                    <FileText className="size-3" /> Attached: {message.attachedFileName}
                  </div>
                ) : null}

                <p className="whitespace-pre-wrap">{message.text}</p>

                {/* Structured AI Report Analysis Card */}
                {message.reply?.reportAnalysis ? (
                  <div className="mt-3 p-3 rounded-xl bg-background text-foreground border border-primary/20 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <FileText className="size-3.5" /> {message.reply.reportAnalysis.fileName || "Lab Report Analysis"}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        AI Analyzed ✓
                      </Badge>
                    </div>

                    {/* Parameters Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left border-collapse">
                        <thead>
                          <tr className="border-b bg-muted/50 text-muted-foreground">
                            <th className="p-1 font-semibold">Test / Parameter</th>
                            <th className="p-1 font-semibold">Observed</th>
                            <th className="p-1 font-semibold">Normal</th>
                            <th className="p-1 font-semibold text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {message.reply.reportAnalysis.parameters.map((param) => (
                            <tr key={param.name}>
                              <td className="p-1 font-medium text-foreground">{param.name}</td>
                              <td className="p-1 font-bold">{param.value}</td>
                              <td className="p-1 text-muted-foreground text-[10px]">{param.normalRange}</td>
                              <td className="p-1 text-right">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] px-1.5 py-0 font-bold",
                                    param.status === "HIGH" && "bg-destructive/15 text-destructive border-destructive/30",
                                    param.status === "LOW" && "bg-amber-500/15 text-amber-600 border-amber-500/30",
                                    param.status === "NORMAL" && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
                                  )}
                                >
                                  {param.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Hindi & English Summary */}
                    <div className="space-y-1 bg-muted/40 p-2 rounded-lg text-[11px]">
                      <p className="font-semibold text-foreground">💡 Summary (Hindi & English):</p>
                      <p className="text-muted-foreground leading-snug">{message.reply.reportAnalysis.summaryHindi}</p>
                    </div>
                  </div>
                ) : null}

                {/* Auto Doctor Match Card */}
                {message.reply?.doctorMatch ? (
                  <div className="mt-3 p-3 rounded-xl bg-primary/10 border border-primary/30 text-foreground space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                        <Sparkles className="size-3" /> Recommended Specialist
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-background font-semibold">
                        {message.reply.doctorMatch.triageLevel}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{message.reply.doctorMatch.doctorName}</p>
                      <p className="text-[11px] text-muted-foreground">{message.reply.doctorMatch.specialization} · {message.reply.doctorMatch.qualifications}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">Consultation Fee: ₹{message.reply.doctorMatch.consultationFee}</p>
                      
                      {/* Slot Availability Notice Badge */}
                      {message.reply.doctorMatch.reason?.includes("Currently no open slots available") ? (
                        <div className="mt-1.5 p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="size-3 text-amber-500 shrink-0" /> Currently no open slots available for online booking.
                        </div>
                      ) : (
                        <div className="mt-1.5 p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-500 shrink-0" /> Open consultation slots available today.
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        "w-full text-xs font-bold gap-1.5 h-8 text-white cursor-pointer shadow-sm",
                        message.reply.doctorMatch.reason?.includes("Currently no open slots available")
                          ? "bg-amber-600 hover:bg-amber-500"
                          : "bg-emerald-600 hover:bg-emerald-500"
                      )}
                      onClick={() => {
                        setOpen(false);
                        navigate({ to: "/doctors/$doctorId", params: { doctorId: message.reply!.doctorMatch!.doctorId } });
                      }}
                    >
                      <CalendarClock className="size-3.5" />
                      {message.reply.doctorMatch.reason?.includes("Currently no open slots available")
                        ? `View ${message.reply.doctorMatch.doctorName}'s Profile`
                        : `Book Slot with ${message.reply.doctorMatch.doctorName}`}
                    </Button>
                  </div>
                ) : null}

                {message.error?.status === 401 ? (
                  <div className="mt-2 pt-2 border-t border-destructive/20">
                    <Button asChild size="sm" variant="outline" className="w-full h-7 text-xs gap-1">
                      <Link to="/login">
                        <LogIn className="size-3" /> Sign in now
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}

            {pending ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />
                Medi AI Assistant is analyzing clinic guidelines & reports…
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-border/80 bg-card/50 p-3 space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            {/* Attached File Chip Preview */}
            {attachedFile ? (
              <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg px-2.5 py-1 text-xs text-primary font-medium">
                <span className="truncate flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Attached: {attachedFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : null}

            <label htmlFor="assistant-input" className="sr-only">
              Ask Medi AI Assistant
            </label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="chat-file-upload"
                className={`p-2.5 rounded-xl border border-border/80 hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0 ${
                  !isAuthenticated ? "opacity-50 pointer-events-none" : ""
                }`}
                title="Attach Medical Report / Prescription File (PDF, JPG, PNG, TXT)"
              >
                <Paperclip className="size-4 text-primary" />
                <input
                  id="chat-file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAttachedFile({ name: file.name });
                      if (!input) setInput(`Analyze my uploaded lab report: ${file.name}`);
                    }
                  }}
                />
              </label>

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
                placeholder={isAuthenticated ? "Ask symptoms or attach lab report file..." : "Sign in to chat"}
                disabled={!isAuthenticated || pending}
                className="max-h-24 min-h-10 resize-none py-2.5 text-xs rounded-xl border-border/80 focus-visible:ring-primary/40"
              />
              <Button
                type="submit"
                size="icon"
                disabled={pending || (!input.trim() && !attachedFile) || !isAuthenticated}
                aria-label="Send message"
                className="shrink-0 rounded-xl"
              >
                <Send className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
