import Image from "next/image";
import Link from "next/link";
import { CTAFooter } from "@/app/(marketing)/cta-footer";
import type { Trail } from "@/packages/schemas/trail.api.schema";

export const TrilhasContent = ({ trilhas }: { trilhas: Trail[] }) => {
  console.log(
    "trilhas",
    trilhas.map((trilha) => trilha.imageUrl),
  );
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Image
        src="/img/fundo-trilhas.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover object-top"
      />

      <Image
        src="/img/header-trilhas.png"
        alt="Pipoca Ágil"
        width={1920}
        height={340}
        priority
        className="h-auto w-full"
      />

      <div className="flex flex-1 flex-col items-center gap-16 px-6 pt-5 pb-24">
        <div className="flex flex-col items-center gap-10">
          {trilhas.map((trilha) => (
            <Link
              key={trilha.id}
              href={`/trilhas/${trilha.id}`}
              className="block w-full max-w-[1200px] overflow-hidden rounded-[20px] border-[3px] border-white/10 transition hover:opacity-90"
            >
              {trilha.imageUrl && (
                <Image
                  unoptimized
                  src={trilha.imageUrl}
                  alt={trilha.title}
                  width={800}
                  height={415}
                  className="h-auto w-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      <CTAFooter />
    </div>
  );
};
