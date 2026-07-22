import Image from "next/image";

type PassoProps = {
  numero: string;
  titulo: string;
  descricao: string;
  icone: string;
};

const Passo = ({ numero, titulo, descricao, icone }: PassoProps) => {
  return (
    <div className="relative w-full">
      <Image
        src="/img/card.png"
        alt=""
        width={600}
        height={140}
        className="h-auto w-full object-contain"
        priority
      />

      <div className="absolute inset-0 flex items-center gap-4 px-6">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center">
          <Image
            src={icone}
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-[#FBBF24] leading-tight">
            {numero}
          </span>
          <span className="text-[17px] font-semibold text-white leading-tight">
            {titulo}
          </span>
          <span className="text-[13px] font-normal text-gray-400 leading-tight">
            {descricao}
          </span>
        </div>
      </div>
    </div>
  );
};

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
          <Passo
            numero="PASSO 1"
            titulo="Escolha a sua trilha"
            descricao="recomendada para o seu momento"
            icone="/img/passo1.png"
          />

          <Image
            src="/img/tracinho.png"
            alt=""
            width={2}
            height={24}
            className="mb-2 mt-2 h-6 w-auto object-contain"
          />

          <Passo
            numero="PASSO 2"
            titulo="Assista aos conteúdos"
            descricao="escolha a sua trilha no seu tempo, onde quiser"
            icone="/img/passo2.png"
          />

          <Image
            src="/img/tracinho.png"
            alt=""
            width={2}
            height={24}
            className="mb-2 mt-2 h-6 w-auto object-contain"
          />

          <Passo
            numero="PASSO 3"
            titulo="Acompanhe seu progresso"
            descricao="e veja sua evolução acontecer"
            icone="/img/passo3.png"
          />
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Image src="/img/pipoca-icone.png" alt="" width={30} height={30} />
          <Image src="/img/pipoca-icone.png" alt="" width={30} height={30} />
        </div>
      </div>
    </section>
  );
};

export default Processo;