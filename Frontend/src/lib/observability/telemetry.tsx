import React, { Component, ErrorInfo, ReactNode } from "react";

export interface TelemetryEvent {
  id: string;
  type: "ERROR" | "WARNING" | "API_FAILURE" | "PERFORMANCE";
  message: string;
  url?: string;
  status?: number;
  durationMs?: number;
  stackTrace?: string;
  timestamp: string;
  environment: string;
}

class TelemetryCollector {
  private events: TelemetryEvent[] = [];
  private maxLogs = 100;
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === "undefined") return;
    this.isInitialized = true;

    // Listen for unhandled JS errors
    window.addEventListener("error", (event) => {
      this.recordEvent({
        type: "ERROR",
        message: event.message || "Unhandled Window Error",
        url: event.filename,
        stackTrace: event.error?.stack,
      });
    });

    // Listen for unhandled Promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.recordEvent({
        type: "ERROR",
        message: typeof event.reason === "string" ? event.reason : event.reason?.message || "Unhandled Promise Rejection",
        stackTrace: event.reason?.stack,
      });
    });

    console.log("[MediSlot Telemetry] Observability collector initialized.");
  }

  public recordEvent(params: {
    type: "ERROR" | "WARNING" | "API_FAILURE" | "PERFORMANCE";
    message: string;
    url?: string;
    status?: number;
    durationMs?: number;
    stackTrace?: string;
  }): TelemetryEvent {
    const event: TelemetryEvent = {
      id: "evt_" + Math.random().toString(36).substring(2, 9),
      type: params.type,
      message: params.message,
      url: params.url || (typeof window !== "undefined" ? window.location.href : ""),
      status: params.status,
      durationMs: params.durationMs,
      stackTrace: params.stackTrace,
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE || "production",
    };

    this.events.unshift(event);
    if (this.events.length > this.maxLogs) {
      this.events.pop();
    }

    if (params.type === "ERROR" || params.type === "API_FAILURE") {
      console.error(`[TELEMETRY_${params.type}]`, event.message, event);
    } else {
      console.log(`[TELEMETRY_${params.type}]`, event.message, event);
    }

    return event;
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }
}

export const telemetry = new TelemetryCollector();
if (typeof window !== "undefined") {
  telemetry.init();
}

// React Error Boundary Component
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TelemetryErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    telemetry.recordEvent({
      type: "ERROR",
      message: `React Component UI Crash: ${error.message}`,
      stackTrace: errorInfo.componentStack || error.stack,
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 my-4 border border-destructive/30 bg-destructive/5 rounded-xl text-center space-y-3">
          <h3 className="font-bold text-lg text-destructive">Something went wrong rendering this section</h3>
          <p className="text-xs text-muted-foreground">
            Our observability monitor recorded this issue. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
