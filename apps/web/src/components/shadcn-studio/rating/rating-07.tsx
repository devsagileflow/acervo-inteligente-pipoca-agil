"use client";

import { useState } from "react";

import { Rating } from "@/components/ui/rating";

type Props = {
  initialValue: number;
  onChange: (value: number) => void;
  precision: number;
};

export const RatingControlled = ({ initialValue = 0, onChange, precision }: Props) => {
  const [starCount, setStarCount] = useState(initialValue);

  return (
    <div className="flex w-full items-baseline-last justify-center gap-4 sm:items-center">
      <div className="flex text-[#F1F5F9] max-sm:flex-col sm:items-center">
        <Rating
          name="teste"
          labels={["Péssimo", "Ruim", "Regular", "Bom", "Excelente"]}
          size={36}
          precision={precision}
          value={starCount}
          onValueChange={(value) => {
            setStarCount(value);
            onChange?.(value);
          }}
        />
      </div>
    </div>
  );
};
