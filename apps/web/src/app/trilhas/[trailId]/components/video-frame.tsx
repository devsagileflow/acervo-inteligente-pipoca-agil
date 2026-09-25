/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrailItem } from "@acervo/schemas";
import { useCallback, useEffect, useRef } from "react";
import { extractYoutubeId } from "./utils";
import { trackVideoCompleted, trackVideoStarted, trackVideoPaused } from "@/lib/analytics";
import { usePathname } from "next/navigation";

// Estender a interface Window para incluir as propriedades do YouTube
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type Props = {
  item: TrailItem;
};

export function VideoFrame({ item }: Props) {
  const pathname = usePathname();
  const iframeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const videoId = item.content?.id ?? "";
  const videoTitle = item.content?.title ?? "";

  const onPlayerStateChange = useCallback(
    (event: any) => {
      console.log("Player state changed:", event.data);
      if (event.data === window.YT.PlayerState.ENDED)
        trackVideoCompleted(pathname, videoId, videoTitle);
      else if (event.data === window.YT.PlayerState.PLAYING)
        trackVideoStarted(pathname, videoId, videoTitle);
      else if (event.data === window.YT.PlayerState.PAUSED)
        trackVideoPaused(pathname, videoId, videoTitle);
    },
    [pathname, videoId, videoTitle],
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
