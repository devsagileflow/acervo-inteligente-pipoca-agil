import mokker from "../../../public/img/Mokker.png";
import bgImg from "../../../public/img/bg-reforço CTA.png";
import Image from "next/image";

export const Reforco = () => {
  return (
    <section className="relative bg-[#080D17] text-white">
      <article className="relative">
        <div className="h-max w-max">
          <Image src={bgImg} alt="Imagem de fundo" className="md:object-cover" />
          <div className="absolute top-1 left-5 grid grid-cols-1 md:top-0 md:left-50 md:flex">
            <Image src={mokker} alt="Imagem de tablet" className="mx-auto size-125 md:size-full" />
            <div className="relative top-1 text-center md:top-50 md:text-left">
              <p className="text-4xl font-bold md:text-7xl">
                QUER APRENDER AGILIDADE SEM PERDER TEMPO BUSCANDO CONTEÚDOS SOLTOS?
              </p>
              <p className="py-5 text-4xl">Comece por aqui!</p>
              <p className="py-5">
                <button
                  type="button"
                  className="group rounded-3xl bg-linear-to-r from-[#0F172A] to-[#6C3DBF] px-10 py-2 font-bold text-[#FBBF24] hover:text-[#6C3D8F]"
                >
                  <a
                    href="#"
                    className="h-full w-full rounded-3xl from-[#FFFFFF] to-[#FBBF24] group-hover:bg-linear-to-r"
                  >
                    EXPLORAR TRILHAS
                  </a>
                </button>
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Reforco;
