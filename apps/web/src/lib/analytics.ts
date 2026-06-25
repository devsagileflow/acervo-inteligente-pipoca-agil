type AnalyticsEventName =
  | "page_view"
  | "click"
  | "scroll_depth"
  | "video_play"
  | "video_complete";

type AnalyticsEventPayload = {
  eventName: AnalyticsEventName;
  pagePath: string;
  anonymousId?: string;
  targetId?: string;
  referrer?: string;
  occurredAt?: string;
  properties?: Record<string, unknown>;
};

const anonymousIdKey = "pipoca-agil:anonymous-id";

export function getAnonymousId() {
  if (typeof window === "undefined") return undefined;

  const storedAnonymousId = window.localStorage.getItem(anonymousIdKey);
  if (storedAnonymousId) return storedAnonymousId;

  const newAnonymousId = window.crypto.randomUUID();
  window.localStorage.setItem(anonymousIdKey, newAnonymousId);
  return newAnonymousId;
}

function getAnalyticsUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (baseUrl) return `${baseUrl.replace(/\/$/, "")}/api/analytics/events`;

  return "/api/analytics/events";
}

export async function trackEvent(payload: AnalyticsEventPayload) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    ...payload,
    anonymousId: payload.anonymousId ?? getAnonymousId(),
    occurredAt: payload.occurredAt ?? new Date().toISOString(),
  });

  const url = getAnalyticsUrl();

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export async function trackPageView(pagePath: string) {
  await trackEvent({
    eventName: "page_view",
    pagePath,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    properties: {
      pathname: pagePath,
    },
  });
}
