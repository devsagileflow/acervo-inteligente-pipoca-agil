"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsEvent } from "@acervo/schemas";
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

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-80 w-full rounded-lg border p-4">
        <Skeleton className="h-full" />
      </div>
    </div>
  );
}

type Props = {
  events: AnalyticsEvent[];
};

export const PageViewChart = ({ events }: Props) => {
  const data = events
    .filter((e) => e.eventName === "page_view" && e.pagePath != "/metricas")
    .map((e) => ({
      pagePath: e.pagePath,
    }))
    .sort((a, b) => b.pagePath.localeCompare(a.pagePath))
    .reduce(
      (acc, curr) => {
        const existing = acc.find((item) => item.pagePath === curr.pagePath);
        if (existing) existing.eventCount += 1;
        else acc.push({ ...curr, eventCount: 1 });

        return acc;
      },
      [] as { pagePath: string; eventCount: number }[],
    )
    .sort((a, b) => b.eventCount - a.eventCount);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pagePath" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="eventCount" fill="#10b981" name="Quantidade" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ButtonClickChart = ({ events }: Props) => {
  const data = events
    .filter((e) => e.eventName === "click")
    .map((e) => ({
      buttonId: (e.properties?.buttonId as string) || "unknown",
      pagePath: e.pagePath || "unknown",
      clickCount: 1,
    }))
    .sort((a, b) => a.buttonId.localeCompare(b.buttonId))
    .reduce(
      (acc, curr) => {
        const existing = acc.find((item) => item.buttonId === curr.buttonId);
        if (existing) existing.clickCount += 1;
        else acc.push({ ...curr, clickCount: 1 });

        return acc;
      },
      [] as { buttonId: string; clickCount: number }[],
    )
    .sort((a, b) => b.clickCount - a.clickCount);

  return (
    <div className="h-80 w-full">
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
  );
};
