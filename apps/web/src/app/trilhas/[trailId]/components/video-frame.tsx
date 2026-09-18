/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrailItem } from "@/packages/schemas";
import { useCallback, useEffect, useRef } from "react";
import { extractYoutubeId } from "./utils";
import { trackVideoCompleted, trackVideoStarted, trackVideoPaused } from "@/lib/analytics";

// Estender a interface Window para incluir as propriedades do YouTube
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoFrame({ item }: { item: TrailItem }) {
  const iframeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const anonymousId = useRef<string>(crypto.randomUUID()).current;
  const videoTitle = item.content?.title ?? "";

  const onPlayerStateChange = useCallback(
    (event: any) => {
      if (event.data === window.YT.PlayerState.ENDED)
        trackVideoCompleted(item.id, anonymousId, videoTitle);
      else if (event.data === window.YT.PlayerState.PLAYING)
        trackVideoStarted(item.id, anonymousId, videoTitle);
      else if (event.data === window.YT.PlayerState.PAUSED)
        trackVideoPaused(item.id, anonymousId, videoTitle);
    },
    [anonymousId, item.id, videoTitle],
  );

  useEffect(() => {
    if (!item.content?.youtubeUrl || !iframeRef.current) return;

    const createPlayer = () => {
      if (!iframeRef.current) return;
      playerRef.current?.destroy?.();
      playerRef.current = new window.YT.Player(iframeRef.current, {
        height: "390",
        width: "640",
        videoId: extractYoutubeId(item.content?.youtubeUrl ?? ""),
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]',
      );
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
    }

    return () => {
      playerRef.current?.destroy?.();
    };
  }, [item, onPlayerStateChange]);

  return (
    // ...
    <div ref={iframeRef} id="youtube-player" className="w-full"></div>
  );
}
