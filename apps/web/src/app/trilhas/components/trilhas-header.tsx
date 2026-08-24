import Image from "next/image";

export const TrilhasHeader = () => (
  <header className="flex bg-[#080D17] items-center gap-4 border-b border-amber-400/40 px-8 py-4">
    <Image src="/img/logo3.png" alt="Pipoca Ágil" width={70} height={70} />
    <span className="text-[17px] font-semibold text-white">
      Acervo Inteligente | Pipoca Ágil
    </span>
  </header>
);