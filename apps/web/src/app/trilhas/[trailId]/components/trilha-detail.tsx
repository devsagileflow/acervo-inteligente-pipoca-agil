"use client";

import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Trail, TrailItem } from "@/packages/schemas/trail.api.schema";
import { trackButtonClick } from "@/lib/analytics";
import { extractYoutubeId, formatMinutes, getThumbnailUrl } from "./utils";
import Link from "next/link";
import { TrilhasHeader } from "../../components/trilhas-header";
import { CTAFooter } from "@/app/(marketing)/cta-footer";

type TrilhaDetailProps = {
  trail: Trail;
};

export function TrilhaDetail({ trail }: TrilhaDetailProps) {
  const items = useMemo(
    () =>
      (trail.items ?? [])
        .filter((item) => item.isActive && !item.deletedAt)
        .sort((a, b) => a.position - b.position),
    [trail.items],
  );
  const [selectedItem, setSelectedItem] = useState<TrailItem | null>(trail.items?.[0] ?? null);
  const handleItemClick = (item: TrailItem) => {
    setSelectedItem(item);
    trackButtonClick(`/trilhas/${trail.id}`, `trilha-item-${item.id}`);
  };

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = leftColumnRef.current;
    if (!node) return;

    const updateHeight = () => setLeftColumnHeight(node.offsetHeight);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [selectedItem]);

  return (
    <>
      <TrilhasHeader />
      <main className="flex min-h-screen flex-col items-center bg-[#0F172A] px-4 pt-8 pb-16 font-sans sm:px-6 lg:px-10 lg:pt-24.25 lg:pb-36.75">
        <div className="flex w-full max-w-7xl flex-col gap-5">
          <Link
            href="/trilhas"
            className="flex w-fit items-center gap-2 text-[#F1F5F9] font-normal leading-none tracking-normal text-lg"
            onClick={() => trackButtonClick(`/trilhas/${trail.id}`, "trilha-voltar")}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>

          <header className="flex w-full flex-col gap-5">
            <h1 className="text-center text-3xl leading-none font-extrabold tracking-normal text-white sm:text-4xl lg:text-[45px]">
              <span className="text-[#FBBF24]">
                {trail.title.split(" ").slice(0, 1).join(" ") + " "}
              </span>
              {trail.title.split(" ").slice(1).join(" ")}
            </h1>
          </header>

          <div className="mt-6 flex w-full flex-col gap-7.5 lg:mt-15 lg:flex-row lg:items-start">
            <section
              ref={leftColumnRef}
              className="flex min-w-0 flex-col gap-7.5 lg:w-1/2 lg:flex-none"
            >
              <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#0F172A] p-4 sm:p-6">
                {selectedItem?.content?.youtubeUrl ? (
                  <>
                    <h2 className="text-center text-xl font-bold text-[#FBBF24] sm:text-2xl">
                      {selectedItem.content.title}
                    </h2>
                    <iframe
                      className="aspect-video w-full rounded-2xl"
                      src={`https://www.youtube.com/embed/${extractYoutubeId(selectedItem.content.youtubeUrl)}`}
                      title={selectedItem.content.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-[#1E293B] text-white">
                    <p className="text-lg font-bold">Nenhum vídeo selecionado</p>
                  </div>
                )}
              </div>

              <div className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1">
                <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-[#0F172A] p-4 sm:p-6">
                  <div className="text-[#F1F5F9]">
                    {selectedItem?.content?.description || ""}
                    {selectedItem?.content?.durationInSeconds && (
                      <div className="flex items-center gap-2">
                        <Clock className="text-[#FBBF24]" />
                        {` (${formatMinutes(selectedItem?.content?.durationInSeconds)})`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex min-w-0 flex-col gap-7.5 lg:w-1/2 lg:flex-none">
              <h2 className="text-start text-2xl font-bold text-[#F1F5F9] sm:text-3xl">
                Outros vídeos da trilha:
              </h2>
              <ol
                className="scrollbar-thin scrollbar-thumb-[#6C3DBF] scrollbar-track-[#1E293B] flex min-w-0 flex-col gap-7.5 overflow-y-auto pr-2 lg:pr-4"
                style={leftColumnHeight ? { maxHeight: leftColumnHeight } : undefined}
              >
                {items
                  .filter((item) => item.id !== selectedItem?.id)
                  .sort((a, b) => a.position - b.position)
                  .map((item, index) => {
                    const video = item.content;

                    if (!video) return null;

                    return (
                      <div key={`trilha-item-wrapper-${item.id}`} className="flex min-w-0 flex-col gap-6">
                        <li
                          className="flex min-w-0 cursor-pointer items-center rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-2xl bg-[#0F172A] p-4 sm:p-6">
                            <div className="flex min-w-0 items-center justify-between gap-4">
                              <h3 className="min-w-0 truncate text-sm font-bold text-white sm:text-base">
                                {item.position}. {video.title}
                                <span className="text-[#FBBF24]">
                                  {` (${formatMinutes(video.durationInSeconds)})`}
                                </span>
                              </h3>
                              <Image
                                src={getThumbnailUrl(extractYoutubeId(video.youtubeUrl) || "")}
                                alt="YouTube"
                                width={92}
                                height={92}
                                className="shrink-0"
                              />
                            </div>
                          </div>
                        </li>
                        {index === 1 && (
                          <Link
                            href={`/trilhas/${trail.id}/feedback`}
                            className="flex min-w-0 cursor-pointer items-center rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1"
                          >
                            <div className="flex flex-1 flex-col items-center gap-4 rounded-2xl bg-[#0F172A] p-4 text-center sm:p-6">
                              <p className="text-base text-white sm:text-xl">
                                Antes de continuar, que tal{" "}
                                <strong>avalar sua experiência até aqui</strong>. É rapidinho.
                              </p>
                              <button className="h-10 w-full max-w-64 cursor-pointer rounded-4xl bg-linear-to-r from-[#0F172A] to-[#6C3DBF]">
                                <span className="font-bold text-[#FBBF24]">RESPONDER</span>
                              </button>
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
              </ol>
            </section>
          </div>
        </div>
      </main>
      <CTAFooter />
    </>
  );
}