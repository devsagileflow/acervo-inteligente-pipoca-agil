/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrailItem } from "@/packages/schemas";
import { useCallback, useEffect, useRef } from "react";
import { extractYoutubeId } from "./utils";
import { trackVideoCompleted, trackVideoStarted } from "@/lib/analytics";

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

  const onPlayerStateChange = useCallback(
    (event: any) => {
      console.log("Player state changed:", event.data);
      if (event.data === window.YT.PlayerState.ENDED) {
        // Vídeo terminou de ser assistido
        trackVideoCompleted(item?.id, anonymousId);
      } else if (event.data === window.YT.PlayerState.PLAYING) {
        // Vídeo iniciou
        trackVideoStarted(item?.id, anonymousId);
      }
    },
    [anonymousId, item?.id],
  );

  useEffect(() => {
    // Carregar o script da YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      if (item?.content?.youtubeUrl && iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          height: "390",
          width: "640",
          videoId: extractYoutubeId(item.content.youtubeUrl),
          events: {
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };
  }, [item, onPlayerStateChange]);

  return (
    // ...
    <div ref={iframeRef} id="youtube-player"></div>
  );
}
