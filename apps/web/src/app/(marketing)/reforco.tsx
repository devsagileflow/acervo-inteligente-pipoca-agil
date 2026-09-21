import mokker from "../../../public/img/Mokker.png";
import bgImg from "../../../public/img/bg-reforço CTA.png";
import Image from "next/image";
import { CTAButton } from "./components/cta-button";

export const Reforco = () => {
  return (
    <section className="relative bg-[#080D17] text-white">
      <article className="relative h-[860px] w-full overflow-hidden md:h-[660px]">
        <Image src={bgImg} alt="Imagem de fundo" fill className="object-cover" priority />

        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col items-center justify-center gap-2 px-5 pb-8 md:flex-row md:justify-center md:gap-3 md:px-10 md:pb-0">
          <Image
            src={mokker}
            alt="Imagem de tablet"
            className="h-auto w-[320px] shrink-0 md:h-[520px] md:w-auto"
          />
          <div className="pb-10 text-center md:max-w-[480px] md:pb-0 md:text-left">
            <p className="text-[28px] font-bold md:text-[34px] md:leading-[1.15]">
              QUER APRENDER AGILIDADE SEM PERDER TEMPO BUSCANDO CONTEÚDOS SOLTOS?
            </p>
            <p className="py-5 text-[25px] md:text-[18px]">Comece por aqui!</p>
            <CTAButton buttonId="button-cta-explore-trails-reforco" />
          </div>
        </div>
      </article>
    </section>
  );
};

export default Reforco;