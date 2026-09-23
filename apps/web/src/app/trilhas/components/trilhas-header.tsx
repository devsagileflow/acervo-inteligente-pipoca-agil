import Image from "next/image";
import Link from "next/link";

export const TrilhasHeader = () => (
  <>
    <header className="fixed top-0 left-0 z-50 w-full rounded-b-xl bg-[linear-gradient(135deg,#FFF9E9_0%,#FBBF24_100%)] pb-[4px]">
      <div className="flex items-center gap-4 rounded-b-[8px] bg-[#080D17] px-8 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src="/img/logo3.png"
            alt="Pipoca Ágil"
            width={70}
            height={70}
            className="h-[56px] w-[56px]"
          />
        </Link>
        <span className="text-[14px] leading-[20px] font-bold tracking-normal text-[#F1F5F9] md:text-[16px] md:leading-[24px]">
          Acervo Inteligente | Pipoca Ágil
        </span>
      </div>
    </header>
    <div className="h-[84px]" aria-hidden="true" />
  </>
);