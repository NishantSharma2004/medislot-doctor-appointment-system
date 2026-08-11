import type { NotificationDto, NotificationType } from "@/lib/api/types";

const STORAGE_KEY_PREFIX = "medislot_notifications_v3_";

function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY_PREFIX}${userId}` : `${STORAGE_KEY_PREFIX}guest`;
}

function loadFromStorage(userId?: string): NotificationDto[] {
  if (typeof window === "undefined" || !userId) return [];
  const key = getStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Personalized clean welcome notification for new accounts
      const welcomeNotification: NotificationDto[] = [
        {
          id: `notif-welcome-${userId}`,
          userId,
          title: "Welcome to MediSlot! 🎉",
          message: "Your account is active. Find top doctors, view available slots, and book your consultation anytime.",
          type: "SYSTEM",
          read: false,
          createdAt: new Date().toISOString(),
          targetUrl: "/doctors",
        },
      ];
      localStorage.setItem(key, JSON.stringify(welcomeNotification));
      return welcomeNotification;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(userId: string | undefined, notifications: NotificationDto[]) {
  if (typeof window === "undefined" || !userId) return;
  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(notifications));
  } catch {
    // Ignore storage errors
  }
}

export const notificationService = {
  async getNotifications(userId?: string): Promise<NotificationDto[]> {
    if (!userId) return [];
    return loadFromStorage(userId);
  },

  async markAsRead(id: string, userId?: string): Promise<void> {
    if (!userId) return;
    const all = loadFromStorage(userId);
    const updated = all.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveToStorage(userId, updated);
  },

  async markAllAsRead(userId?: string): Promise<void> {
    if (!userId) return;
    const all = loadFromStorage(userId);
    const updated = all.map((n) => ({ ...n, read: true }));
    saveToStorage(userId, updated);
  },

  async addNotification(params: {
    userId?: string;
    title: string;
    message: string;
    type: NotificationType;
    targetUrl?: string;
  }): Promise<NotificationDto> {
    if (!params.userId) return {} as NotificationDto;
    const all = loadFromStorage(params.userId);
    const newNotif: NotificationDto = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      createdAt: new Date().toISOString(),
      targetUrl: params.targetUrl,
    };
    const updated = [newNotif, ...all];
    saveToStorage(params.userId, updated);
    return newNotif;
  },

  async clearAll(userId?: string): Promise<void> {
    if (!userId) return;
    saveToStorage(userId, []);
  },
};
