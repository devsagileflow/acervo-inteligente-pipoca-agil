"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackPageView } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const fullPath = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
    if (lastTrackedPath.current === fullPath) return;

    lastTrackedPath.current = fullPath;
    void trackPageView(pathname);
  }, [pathname, searchParams]);

  return null;
}
