"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type FaqItemProps = {
  question: string;
  answer: string;
};

export const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full rounded-2xl bg-linear-to-r from-[#6C3DBF] to-[#FCD34D] p-0.5"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="grid w-full rounded-2xl bg-[#0F172A] px-10 py-3 text-left"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold">{question}</p>
          <Image
            src={isOpen ? "/svg/seta-pra-cima.svg" : "/svg/seta-pra-baixo.svg"}
            alt={isOpen ? "Recolher" : "Expandir"}
            width={24}
            height={24}
          />
        </div>
        {isOpen && <p className="py-4">{answer}</p>}
      </button>
    </div>
  );
};

export default FaqItem;
