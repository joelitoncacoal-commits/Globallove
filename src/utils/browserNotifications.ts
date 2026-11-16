import { sanitizeText } from './security';

const PREF_KEY = 'gl_browser_notif_enabled';

export type BrowserNotifPermission = NotificationPermission | 'unsupported';

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): BrowserNotifPermission {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return window.Notification.permission;
}

export function isBrowserNotificationEnabled(): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (window.Notification.permission !== 'granted') return false;
  try {
    const saved = window.localStorage.getItem(PREF_KEY);
    return saved !== 'false';
  } catch {
    return true;
  }
}

export function setBrowserNotificationEnabledPref(enabled: boolean): void {
  try {
    window.localStorage.setItem(PREF_KEY, enabled ? 'true' : 'false');
  } catch {
    // ignore storage quota / private mode
  }
}

async function getNotificationSWRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration('/sw-notifications.js');
    if (existing) return existing;
    return await navigator.serviceWorker.register('/sw-notifications.js', { scope: '/' });
  } catch {
    return null;
  }
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotifPermission> {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  try {
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      setBrowserNotificationEnabledPref(true);
      await getNotificationSWRegistration();
    }
    return permission;
  } catch {
    return getBrowserNotificationPermission();
  }
}

export async function showNativeBrowserNotification(params: {
  title: string;
  body: string;
  link?: string;
  tag?: string;
  onNavigate?: (link: string) => void;
}): Promise<boolean> {
  if (!isBrowserNotificationEnabled()) return false;

  const cleanTitle = sanitizeText(params.title, 100) || 'GlobalLove.com';
  const cleanBody = sanitizeText(params.body, 220);
  const link = params.link && params.link.startsWith('/') ? params.link : '/';

  const swReg = await getNotificationSWRegistration();
  if (swReg && typeof swReg.showNotification === 'function') {
    try {
      await swReg.showNotification(cleanTitle, {
        body: cleanBody,
        icon: '/icons/icon-192.webp',
        badge: '/favicon.png',
        tag: params.tag || `gl_${Date.now()}`,
        data: { link },
      });
      return true;
    } catch {
      // Fallback to standard Notification constructor below
    }
  }

  try {
    const notif = new window.Notification(cleanTitle, {
      body: cleanBody,
      icon: '/icons/icon-192.webp',
      tag: params.tag || `gl_${Date.now()}`,
    });
    notif.onclick = () => {
      window.focus();
      if (params.onNavigate) params.onNavigate(link);
      notif.close();
    };
    return true;
  } catch {
    return false;
  }
}
