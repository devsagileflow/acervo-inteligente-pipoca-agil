"use client";

import { Clock } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import type { Trail, TrailItem } from "@/packages/schemas/trail.api.schema";

const formatMinutes = (seconds: number) => `${Math.round(seconds / 60)} min`;

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
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0F172A] px-10 pt-24.25 pb-36.75 font-sans">
      {/* Header */}
      <header className="flex w-full flex-col gap-5">
        <h1 className="text-center text-[45px] leading-none font-extrabold tracking-normal text-white">
          <span className="text-[#FBBF24]">
            {trail.title.split(" ").slice(0, 1).join(" ") + " "}
          </span>
          {trail.title.split(" ").slice(1).join(" ")}
        </h1>
      </header>

      {/* Video Player */}
      <section className="mt-15 flex w-full flex-col gap-7.5 rounded-3xl p-6.25">
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#0F172A] p-6">
          {selectedItem?.content?.youtubeUrl ? (
            <>
              <h2 className="text-center text-2xl font-bold text-[#FBBF24]">
                {selectedItem.content.title}
              </h2>
              <iframe
                className="aspect-video w-full rounded-2xl"
                src={`https://www.youtube.com/embed/${selectedItem.content.youtubeUrl.split("v=")[1] || selectedItem.content.youtubeUrl.split("youtu.be/")[1]}`}
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

        {/* Video Description and Duration */}
        <div className="w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1">
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-[#0F172A] p-6">
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

      {/* Card */}
      <section className="mt-15 flex w-full flex-col gap-7.5 rounded-3xl p-6.25">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold text-[#F1F5F9]">Outros vídeos da trilha:</h1>
        {/* Items */}
        <ol className="flex flex-col gap-7.5">
          {items
            .filter((item) => item.id !== selectedItem?.id)
            .map((item) => {
              const video = item.content;

              if (!video) return null;

              return (
                <li
                  key={item.id}
                  className={`flex cursor-pointer items-center rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-1`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-2xl bg-[#0F172A] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="truncate text-base font-bold text-white">
                        {item.position}. {video.title}
                        <span className="text-[#FBBF24]">
                          {` (${formatMinutes(video.durationInSeconds)})`}
                        </span>
                      </h3>
                      <Image
                        src={`https://img.youtube.com/vi/${video.youtubeUrl.split("v=")[1] || video.youtubeUrl.split("youtu.be/")[1]}/maxresdefault.jpg`}
                        alt="YouTube"
                        width={92}
                        height={92}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
        </ol>
      </section>
    </main>
  );
}
