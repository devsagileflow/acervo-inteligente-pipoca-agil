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

type PageAccessData = {
  pagePath: string;
  uniqueUsers: number;
  eventCount: number;
};

type Props = {
  data: PageAccessData[];
  totalUniqueUsers: number;
  totalEvents: number;
};

export const PageAccessChart = ({ data, totalUniqueUsers, totalEvents }: Props) => {
  if (data.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Acesso às Páginas</h3>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Usuários Únicos</p>
            <p className="text-2xl font-bold">{totalUniqueUsers}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">Total de Eventos</p>
            <p className="text-2xl font-bold">{totalEvents}</p>
          </div>
        </div>
        <div className="h-80 w-full rounded-lg border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pagePath" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="uniqueUsers" fill="#3b82f6" name="Usuários Únicos" />
              <Bar dataKey="eventCount" fill="#10b981" name="Eventos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
