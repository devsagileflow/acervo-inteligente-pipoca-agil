import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CTAFooter } from "@/app/(marketing)/cta-footer";
import { TrilhasHeader } from "./trilhas-header";
import type { Trail } from "@acervo/schemas";
import { getTrailStats } from "./trilha-content";
import { CTAButton } from "./cta-button";

const TrilhaTitle = ({ title }: { title: string }) => {
  const [firstWord, ...rest] = title.split(" ");
  return (
    <h2 className="text-4xl leading-none font-bold tracking-normal text-white">
      {firstWord} <span className="text-amber-400">{rest.join(" ")}</span>
    </h2>
  );
};

const MAX_VISIBLE_TAGS = 3;

const TrilhaTags = ({ tags }: { tags: string[] }) => {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const remaining = tags.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((tag) => (
        <span
          key={tag}
          className="flex h-[25px] cursor-pointer items-center rounded-[5px] bg-gradient-to-r from-[#6C3DBF] to-[#FCD34D] px-4 py-2 text-xs font-bold text-black"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="flex h-[25px] cursor-pointer items-center rounded-[5px] bg-gradient-to-r from-[#6C3DBF] to-[#FCD34D] px-4 py-2 text-xs font-bold text-black">
          + {remaining}
        </span>
      )}
    </div>
  );
};

const TrilhaCard = ({ trilha }: { trilha: Trail }) => {
  const { videosCount, durationLabel } = getTrailStats(trilha);

  const specs = trilha.specs ?? [];
  const specRows = specs.length >= 4 ? specs.slice(2) : specs;

  return (
    <div className="w-full max-w-[1400px] rounded-3xl border border-amber-400/60 bg-[#0c1225] p-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <TrilhaTags tags={trilha.tags ?? []} />
          <TrilhaTitle title={trilha.title} />

          {trilha.description && (
            <p className="text-justify text-base leading-relaxed tracking-normal whitespace-pre-wrap text-[#F1F5F9]">
              {trilha.description}
            </p>
          )}

          <CTAButton trilha={trilha} />
        </div>

        <div className="flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-[20px] bg-[#060A12]/40 pb-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:max-w-[520px] md:justify-self-end">
          {trilha.imageUrl && (
            <Image
              unoptimized
              src={trilha.imageUrl}
              alt={trilha.title}
              width={800}
              height={415}
              className="-m-3 h-auto w-[calc(100%+1.5rem)] max-w-none object-cover"
            />
          )}

          <div className="flex flex-col gap-3 px-6 text-sm text-white">
            {videosCount > 0 && (
              <div className="flex items-center gap-3">
                <Image
                  src="/img/video-lg.png"
                  alt="Ícone de vídeo"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span>{videosCount} vídeos</span>
              </div>
            )}
            {durationLabel && (
              <div className="flex items-center gap-3">
                <Image
                  src="/img/duracao.png"
                  alt="Ícone de vídeo"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span>{durationLabel}</span>
              </div>
            )}
            {specRows.map((spec, index) => (
              <div key={`${index}-${spec}`} className="flex items-center gap-3">
                <Image
                  src={
                    spec.toLowerCase().startsWith("ritmo") ? "/img/livro.png" : "/img/duracao2.png"
                  }
                  alt="Ícone de vídeo"
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrilhasContent = ({ trilhas }: { trilhas: Trail[] }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0F172A]">
      <TrilhasHeader />

      <div className="flex flex-1 flex-col items-center gap-8 px-6 pt-8 pb-24 md:gap-16 md:pt-16">
        <div className="flex w-full max-w-[1400px] flex-col gap-8 md:gap-5">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-lg leading-none font-normal tracking-normal text-[#F1F5F9]"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>

          <h1 className="text-center text-[30px] font-extrabold text-white md:text-[45px]">
            ESCOLHA A <span className="text-amber-400">SUA TRILHA</span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-10">
          {trilhas.map((trilha) => (
            <TrilhaCard key={trilha.id} trilha={trilha} />
          ))}
        </div>
      </div>

      <CTAFooter />
    </div>
  );
};
