import type { NotificationDto, NotificationType } from "@/lib/api/types";

const STORAGE_KEY = "medislot_notifications_v1";

const INITIAL_NOTIFICATIONS: NotificationDto[] = [
  {
    id: "notif-1",
    title: "Appointment Confirmed! 🟢",
    message: "Dr. Rajesh Sharma confirmed your consultation slot for tomorrow at 10:00 AM.",
    type: "APPOINTMENT_CONFIRMED",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    targetUrl: "/appointments",
  },
  {
    id: "notif-2",
    title: "Digital Prescription Ready 📄",
    message: "Dr. Vikram Shetty has issued a PDF prescription for your Cardiology consultation.",
    type: "PRESCRIPTION_GENERATED",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    targetUrl: "/dashboard",
  },
  {
    id: "notif-3",
    title: "Upcoming Appointment Reminder ⏰",
    message: "You have an upcoming consultation with Dr. Sneha Kulkarni today at 4:30 PM.",
    type: "APPOINTMENT_REMINDER",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    targetUrl: "/appointments",
  },
  {
    id: "notif-4",
    title: "Welcome to MediSlot! 🎉",
    message: "Your account is active. Use AI Assistant for 1-click doctor matching & report analysis.",
    type: "SYSTEM",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

function loadFromStorage(): NotificationDto[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

function saveToStorage(notifications: NotificationDto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Ignore storage errors
  }
}

export const notificationService = {
  async getNotifications(userId?: string): Promise<NotificationDto[]> {
    if (!userId) return [];
    const all = loadFromStorage();
    return all.filter((n) => !n.userId || n.userId === userId);
  },

  async markAsRead(id: string): Promise<void> {
    const all = loadFromStorage();
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(updated);
  },

  async markAllAsRead(userId?: string): Promise<void> {
    const all = loadFromStorage();
    const updated = all.map((n) => {
      if (!userId || !n.userId || n.userId === userId) {
        return { ...n, read: true };
      }
      return n;
    });
    saveToStorage(updated);
  },

  async addNotification(params: {
    userId?: string;
    title: string;
    message: string;
    type: NotificationType;
    targetUrl?: string;
  }): Promise<NotificationDto> {
    const all = loadFromStorage();
    const newNotif: NotificationDto = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: params.targetUrl,
    };
    const updated = [newNotif, ...all];
    saveToStorage(updated);
    return newNotif;
  },

  async clearAll(): Promise<void> {
    saveToStorage([]);
  },
};
