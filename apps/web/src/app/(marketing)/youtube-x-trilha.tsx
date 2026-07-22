import Image from "next/image";

const bullets = {
  youtube: [
    "Conteúdo desestruturado",
    "Você decide o que aprender",
    "Tempo perdido buscando vídeos",
    "Falta de clareza sobre progresso",
  ],
  trilha: [
    "Conteúdos organizados em trilhas",
    "Sequência lógica de aprendizado",
    "Clareza sobre por onde começar",
    "Navegação entre conteúdos",
  ],
};

export const YoutubeXTrilha = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-6 py-14 lg:px-16">
      <div className="mt-3 relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <h2 className="mb-3 text-center text-2xl font-bold leading-[1.2] tracking-[-0.02em] text-white sm:text-[32px]">
          <span className="text-[#FBBF24]">TRILHAS</span> ORGANIZADAS QUE REALMENTE
          <br className="hidden sm:block" /> FAZEM VOCÊ <span className="text-[#FBBF24]">EVOLUIR</span>
        </h2>

        <div className="flex w-full max-w-[320px] flex-col items-center gap-6 sm:hidden">
          <div className="flex w-full flex-col items-center gap-3">
            <Image
              src="/img/img-youtube.png"
              alt="YouTube conteúdo desorganizado"
              width={320}
              height={230}
              className="h-auto w-full object-contain"
            />
            <div className="flex w-full items-center justify-center gap-3">
              <span className="text-sm font-bold uppercase tracking-wide text-[#FBBF24]">
                Youtube
              </span>
              <Image src="/img/forward.png" alt="" width={18} height={18} />
            </div>
            <ul className="flex w-fit mx-auto flex-col items-start gap-2 text-sm text-white/90">
              {bullets.youtube.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1 w-1 shrink-0 bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-1">
            <Image src="/img/vs-icone.png" alt="" width={60} height={46} />
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <Image
              src="/img/img-trilha.png"
              alt="Trilha com progresso organizado"
              width={320}
              height={230}
              className="h-auto w-full object-contain"
            />
            <div className="flex w-full items-center justify-center gap-3">
              <span className="text-sm font-bold uppercase tracking-wide text-[#FBBF24]">
                Trilha
              </span>
              <Image src="/img/trilha.png" alt="" width={18} height={18} />
            </div>
            <ul className="flex w-fit mx-auto flex-col items-start gap-2 text-sm text-white/90">
              {bullets.trilha.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1 w-1 shrink-0 bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden w-full max-w-3xl sm:flex sm:flex-col sm:items-center sm:gap-6">
          <div className="relative flex justify-center gap-4">
            <Image
              src="/img/img-youtube.png"
              alt="YouTube conteúdo desorganizado"
              width={320}
              height={230}
              className="h-auto w-[320px] object-contain"
            />
            <Image
              src="/img/img-trilha.png"
              alt="Trilha com progresso organizado"
              width={320}
              height={230}
              className="h-auto w-[320px] object-contain"
            />

            <div className="absolute top-[180px] flex items-center">
              <Image src="/img/vs-icone.png" alt="" width={60} height={46} />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className="flex w-[320px] items-center justify-center gap-3">
              <span className="text-[14px] font-semibold uppercase tracking-wide text-[#FBBF24]">
                Youtube
              </span>
              <Image src="/img/forward.png" alt="" width={18} height={18} />
            </div>
            <div className="flex w-[320px] items-center justify-center gap-3">
              <span className="text-[14px] font-semibold uppercase tracking-wide text-[#FBBF24]">
                Trilha
              </span>
              <Image src="/img/trilha.png" alt="" width={18} height={18} />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <ul className="flex w-[320px] flex-col gap-2 text-base text-white/90">
              {bullets.youtube.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
            <ul className="flex w-[320px] flex-col gap-2 text-base text-white/90">
              {bullets.trilha.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-white/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <Image src="/img/pipoca-icone.png" alt="" width={30} height={30} />
          <Image src="/img/pipoca-icone.png" alt="" width={30} height={30} />
        </div>
      </div>
    </section>
  );
};

export default YoutubeXTrilha;