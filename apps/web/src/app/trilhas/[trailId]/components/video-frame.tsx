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
  const isPlayingRef = useRef(false);
  const videoId = item.content?.id ?? "";
  const videoTitle = item.content?.title ?? "";

  const onPlayerStateChange = useCallback(
    (event: any) => {
      console.log("Player state changed:", event.data);
      if (event.data === window.YT.PlayerState.ENDED) {
        isPlayingRef.current = false;
        trackVideoCompleted(pathname, videoId, videoTitle);
      } else if (event.data === window.YT.PlayerState.PLAYING) {
        isPlayingRef.current = true;
        trackVideoStarted(pathname, videoId, videoTitle);
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        isPlayingRef.current = false;
        trackVideoPaused(pathname, videoId, videoTitle);
      }
    },
    [pathname, videoId, videoTitle],
  );

  // Captura abandono ao fechar a aba / sair da plataforma
  // (o cleanup do React não é executado nesse caso)
  useEffect(() => {
    const handlePageHide = () => {
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        trackVideoPaused(pathname, videoId, videoTitle);
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [pathname, videoId, videoTitle]);

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
      // Captura abandono ao trocar de vídeo ou navegar para outra página
      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        trackVideoPaused(pathname, videoId, videoTitle);
      }
      playerRef.current?.destroy?.();
    };
  }, [item, onPlayerStateChange, pathname, videoId, videoTitle]);

  return (
    // ...
    <div ref={iframeRef} id="youtube-player" className="w-full"></div>
  );
}
