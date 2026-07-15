import mokker from "../../../public/img/Mokker.png";
import bgImg from "../../../public/img/bg-reforço CTA.png";
import Image from "next/image";
import { CTAButton } from "./components/cta-button";

export const Reforco = () => {
  return (
    <section className="relative bg-[#080D17] text-white">
      <article className="relative md:overflow-hidden">
        <div className="h-max w-max">
          <Image src={bgImg} alt="Imagem de fundo" className="md:object-cover" />
          <div className="absolute top-1 left-5 grid grid-cols-1 md:top-0 md:left-50 md:flex">
            <Image src={mokker} alt="Imagem de tablet" className="mx-auto size-125 md:size-full" />
            <div className="relative top-1 text-center md:top-50 md:text-left">
              <p className="text-4xl font-bold md:text-7xl">
                QUER APRENDER AGILIDADE SEM PERDER TEMPO BUSCANDO CONTEÚDOS SOLTOS?
              </p>
              <p className="py-5 text-4xl">Comece por aqui!</p>
              <CTAButton />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Reforco;
