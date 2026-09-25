"use client";

import Link from "next/link";
import { trackButtonClick } from "@/lib/analytics";
import { Trail } from "@acervo/schemas";

export const CTAButton = ({ trilha }: { trilha: Trail }) => {
  return (
    <div>
      <Link href={`/trilhas/${trilha.id}`}>
        <button
          id={`button-cta-explore-trails-${trilha.id}`}
          type="button"
          className="hover:bg-gradient-t-r inline-flex cursor-pointer items-center gap-3 rounded-[15px] border-r-2 border-b-2 border-l-2 border-[#0F172A] bg-gradient-to-r from-[#0F172A] to-[#6C3DBF] px-10 py-2.5 text-sm font-bold tracking-wide text-[#FBBF24] uppercase shadow-[0_15px_40px_0_rgba(0,0,0,0.25)] transition hover:border-[#FBBF24] hover:from-[#FFFFFF] hover:to-[#FBBF24] hover:text-[#0F172A]"
          onClick={() => {
            trackButtonClick(`/trilhas`, `button-cta-explore-trails-${trilha.id}`, trilha.id);
          }}
        >
          INICIAR TRILHA
        </button>
      </Link>
    </div>
  );
};
