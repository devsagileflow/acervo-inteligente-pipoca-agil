import Image from "next/image";
import Link from "next/link";
import { Play, Clock, BookOpen } from "lucide-react";
import { CTAFooter } from "@/app/(marketing)/cta-footer";
import { TrilhasHeader } from "./trilhas-header";
import type { Trail } from "@/packages/schemas/trail.api.schema";
import { getTrailStats, parseTrailDescription } from "./trilha-content";


const TrilhaTitle = ({ title }: { title: string }) => {
  const [firstWord, ...rest] = title.split(" ");
  return (
    <h2 className="text-4xl leading-none tracking-normal font-bold text-white">
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
          className="flex cursor-pointer h-[25px] items-center rounded-[5px] bg-gradient-to-r from-[#6C3DBF] to-[#FCD34D] px-4 py-2 text-xs font-bold text-black"
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="flex cursor-pointer h-[25px] items-center rounded-[5px] bg-gradient-to-r from-[#6C3DBF] to-[#FCD34D] px-4 py-2 text-xs font-bold text-black">
          + {remaining}
        </span>
      )}
    </div>
  );
};

const TrilhaCard = ({ trilha }: { trilha: Trail }) => {
  const { summary, tags, fichaTecnica } = parseTrailDescription(trilha.description);
  const { videosCount, durationLabel } = getTrailStats(trilha);

  return (
    <div className="w-full max-w-[1400px] rounded-3xl border border-amber-400/60 bg-[#0c1225] p-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <TrilhaTags tags={tags} />
          <TrilhaTitle title={trilha.title} />

          {summary && (
            <p className="leading-relaxed tracking-normal text-[#F1F5F9] text-base whitespace-pre-wrap text-justify">{trilha.description}</p>
          )}

          <Link
            href={`/trilhas/${trilha.id}`}
            className="hover:bg-gradient-t-r inline-flex items-center gap-3 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-10 py-2.5 text-sm font-bold tracking-wide text-[#FBBF24] uppercase shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:border-[#FBBF24] hover:from-[#FFFFFF] hover:to-[#FBBF24] hover:text-[#0F172A]"
          >
            INICIAR TRILHA
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {trilha.imageUrl && (
            <Image
              unoptimized
              src={trilha.imageUrl}
              alt={trilha.title}
              width={800}
              height={415}
              className="h-auto w-full rounded-xl object-cover"
            />
          )}

          <div className="flex flex-col gap-2 text-sm text-white/80">
            {videosCount > 0 && (
              <div className="flex items-center gap-2">
                <Image src="/img/video-lg.png" alt="Ícone de vídeo" width={16} height={16} />
                <span>{videosCount} vídeos</span>
              </div>
            )}
            {durationLabel && (
              <div className="flex items-center gap-2">
                <Image src="/img/duracao.png" alt="Ícone de vídeo" width={16} height={16} />
                <span>{durationLabel}</span>
              </div>
            )}
            {fichaTecnica && (
              <div className="flex items-center gap-2">
                <Image src="/img/duracao2.png" alt="Ícone de vídeo" width={16} height={16} />
                <span>{fichaTecnica}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrilhasContent = ({ trilhas }: { trilhas: Trail[] }) => {
  return (
    <div className="relative bg-[#0F172A] flex min-h-screen w-full flex-col">
      <TrilhasHeader />

      <div className="flex flex-1 flex-col items-center gap-16 px-6 pt-16 pb-24">
       <h1 className="text-center text-[30px] md:text-[45px] font-extrabold text-white">
          ESCOLHA A <span className="text-amber-400">SUA TRILHA</span>
       </h1>

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
