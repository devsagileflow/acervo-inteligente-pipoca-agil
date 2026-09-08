"use client";

import { useState } from "react";

import { Rating } from "@/components/ui/rating";

type Props = {
  initialValue: number;
  onChange: (value: number) => void;
  precision: number;
};

const RatingControlledDemo = ({ initialValue = 0, onChange, precision }: Props) => {
  const [starCount, setStarCount] = useState(initialValue);

  return (
    <div className="flex items-baseline-last justify-between gap-4 sm:items-center">
      <div className="flex gap-4 max-sm:flex-col sm:items-center">
        <Rating
          name="teste"
          labels={["Muito ruim", "Ruim", "Regular", "Bom", "Muito bom"]}
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

export default RatingControlledDemo;
