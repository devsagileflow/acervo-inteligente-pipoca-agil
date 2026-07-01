import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9E9] to-[#FBBF24] px-8 py-16 lg:px-16">
      <Image
        src="/img/fundo-pipoca.png"
        alt=""
        fill
        className="object-cover"
        priority
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 lg:flex-row lg:justify-between lg:gap-8">
        <div className="order-2 flex flex-col items-center gap-5 text-center lg:order-1 lg:items-start lg:text-left">
          <h1 className="text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#0F172A] sm:text-[41px]">
            APRENDA AGILIDADE COM{" "}
            <span className="bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] bg-clip-text text-transparent">
              TRILHAS ORGANIZADAS
            </span>
            , NÃO VÍDEOS SOLTOS
          </h1>

          <p className="max-w-md text-base text-[#0F172A] sm:text-[20px]">
            Transformamos conteúdos do Pipoca Ágil em jornadas de
            aprendizado estruturadas.
          </p>

          <div>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#FBBF24] shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:opacity-90"
            >
              Explorar trilhas
            </button>
          </div>

          <p className="text-base text-[#0F172A] sm:text-[20px]">
            Conteúdos organizados em trilhas |{" "}
            <span className="bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] bg-clip-text text-transparent">
              100% GRATUITO
            </span>
          </p>
        </div>

        <div className="order-1 relative h-[280px] w-full max-w-[260px] shrink-0 sm:h-[360px] sm:max-w-sm lg:order-2 lg:h-[440px]">
          <Image
            src="/img/logo.png"
            alt="Pipoca Ágil - logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;