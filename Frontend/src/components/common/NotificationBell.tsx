import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock, FileText, Info, XCircle, CheckCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { NotificationDto, NotificationType } from "@/lib/api/types";
import { notificationService } from "@/services/notification.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "APPOINTMENT_CONFIRMED":
      return <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />;
    case "APPOINTMENT_CANCELLED":
      return <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />;
    case "PRESCRIPTION_GENERATED":
      return <FileText className="size-4 text-blue-500 shrink-0 mt-0.5" />;
    case "APPOINTMENT_REMINDER":
      return <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />;
    case "SYSTEM":
    default:
      return <Info className="size-4 text-primary shrink-0 mt-0.5" />;
  }
}

export function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user?.id) {
      setNotifications([]);
      return;
    }
    const list = await notificationService.getNotifications(user.id);
    setNotifications(list);
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    fetchNotifications();
    // Poll for fresh notifications every 8 seconds
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated || !user) return null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    return true;
  });

  const handleMarkAsRead = async (id: string, targetUrl?: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (targetUrl) {
      setIsOpen(false);
      navigate({ to: targetUrl as any });
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-popover p-0 shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  {unreadCount} New
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  filter === "ALL" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("UNREAD")}
                className={`text-xs px-2 py-1 rounded-md transition-colors ${
                  filter === "UNREAD" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Sub-header Actions */}
          {unreadCount > 0 && (
            <div className="flex items-center justify-between px-4 py-1.5 bg-accent/40 border-b text-[11px] text-muted-foreground">
              <span>Unread alerts</span>
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <CheckCheck className="size-3" /> Mark all read
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Bell className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                {filter === "UNREAD" ? "No unread notifications!" : "No notifications yet."}
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id, notif.targetUrl)}
                  className={`p-3 transition-colors cursor-pointer flex gap-3 items-start ${
                    !notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-accent/50 opacity-85"
                  }`}
                >
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-semibold truncate ${!notif.read ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" title="Unread" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
