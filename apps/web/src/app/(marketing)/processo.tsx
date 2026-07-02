import Image from "next/image";

export const Processo = () => {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-6 pb-14 pt-6 lg:px-16 lg:pt-8">
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 lg:gap-8">
        <h2 className="mb-3 text-center font-bold leading-[1.1] tracking-[-0.02em] text-white text-[30px] sm:text-[30px] lg:mb-7 lg:text-[35px]">
          COMO{" "}
          <span className="bg-gradient-to-r from-[#6C3DBF] to-[#FBBF24] bg-clip-text text-transparent">
            FUNCIONA
          </span>{" "}
          A PLATAFORMA
        </h2>

        <div className="flex w-full max-w-xl flex-col items-center">
          <Image
            src="/img/passo1.png"
            alt="Passo 1 - Escolha a sua trilha recomendada para o seu momento"
            width={600}
            height={140}
            className="h-auto w-full object-contain"
          />

          <Image
            src="/img/tracinho.png"
            alt=""
            width={2}
            height={24}
            className="h-6 mb-2 mt-2 w-auto object-contain"
          />

          <Image
            src="/img/passo2.png"
            alt="Passo 2 - Assista aos conteúdos, escolha a sua trilha no seu tempo, onde quiser"
            width={600}
            height={140}
            className="h-auto w-full object-contain"
          />

          <Image
            src="/img/tracinho.png"
            alt=""
            width={2}
            height={24}
            className="h-6 mb-2 mt-2 w-auto object-contain"
          />

          <Image
            src="/img/passo3.png"
            alt="Passo 3 - Acompanhe seu progresso e veja sua evolução acontecer"
            width={600}
            height={140}
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Image src="/img/pipoca-icone.png" alt="" width={26} height={26} />
          <Image src="/img/pipoca-icone.png" alt="" width={26} height={26} />
        </div>
      </div>
    </section>
  );
};

export default Processo;