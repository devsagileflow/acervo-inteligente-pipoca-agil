"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ButtonClickData = {
  buttonId: string;
  clickCount: number;
  pathCount: number;
};

type Props = {
  data: ButtonClickData[];
  totalClickEvents: number;
  totalUniqueButtons: number;
};

export const ButtonClickChart = ({ data, totalClickEvents, totalUniqueButtons }: Props) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Cliques em Botões</h3>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Total de Cliques</p>
            <p className="text-2xl font-bold">{totalClickEvents}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Botões Únicos</p>
            <p className="text-2xl font-bold">{totalUniqueButtons}</p>
          </div>
        </div>
        <div className="h-80 w-full rounded-lg border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="buttonId" type="category" width={190} />
              <Tooltip />
              <Legend />
              <Bar dataKey="clickCount" fill="#ef4444" name="Cliques" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
