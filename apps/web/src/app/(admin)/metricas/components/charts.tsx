"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsEvent, Video } from "@acervo/schemas";
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
    <div className="h-100 w-full">
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

type VideoChartProps = Props & {
  videos: Video[];
};

export const VideoChart = ({ events, videos }: VideoChartProps) => {
  const data = events
    .filter((e) => ["video_complete", "video_play", "video_paused"].includes(e.eventName))
    .map((e) => ({
      videoId: (e.properties?.videoId as string) || "unknown",
      videoTitle: (e.properties?.videoTitle as string) || "unknown",
      pagePath: e.pagePath || "unknown",
      eventCompleteCount: e.eventName === "video_complete" ? 1 : 0,
      eventPlayCount: e.eventName === "video_play" ? 1 : 0,
      eventPausedCount: e.eventName === "video_paused" ? 1 : 0,
      videoDurationInSeconds:
        videos.find((v) => v.id === (e.properties?.videoId as string))?.durationInSeconds || 0,
      userId: e.userId,
      anonymousId: e.anonymousId,
      createdAt: e.createdAt,
    }))
    .sort((a, b) => a.videoId.localeCompare(b.videoId))
    .reduce(
      (acc, curr) => {
        const key = `${curr.videoId}-${curr.userId || curr.anonymousId}`;
        const existing = acc.find((item) => item.key === key);

        if (existing) {
          if (existing.eventPlayCount && curr.eventPausedCount)
            existing.eventPlaybackTime +=
              (new Date(curr.createdAt).getTime() - new Date(existing.createdAt).getTime()) / 1000;

          existing.createdAt = curr.createdAt;
          existing.eventCompleteCount += curr.eventCompleteCount;
          existing.eventPlayCount += curr.eventPlayCount;
          existing.eventPausedCount += curr.eventPausedCount;
        } else {
          acc.push({
            key,
            videoId: curr.videoId,
            videoTitle: curr.videoTitle,
            pagePath: curr.pagePath,
            userId: curr.userId,
            anonymousId: curr.anonymousId,
            videoDurationInSeconds: curr.videoDurationInSeconds,
            eventPlaybackTime: 0,
            eventCompleteCount: curr.eventCompleteCount,
            eventPlayCount: curr.eventPlayCount,
            eventPausedCount: curr.eventPausedCount,
            createdAt: curr.createdAt,
          });
        }

        return acc;
      },
      [] as {
        key: string;
        videoId: string;
        videoTitle: string;
        pagePath: string;
        userId: string | null | undefined;
        anonymousId: string | null | undefined;
        videoDurationInSeconds: number;
        eventPlaybackTime: number;
        eventCompleteCount: number;
        eventPlayCount: number;
        eventPausedCount: number;
        createdAt: Date;
      }[],
    )
    .reduce(
      (acc, curr) => {
        const existing = acc.find((item) => item.videoId === curr.videoId);

        if (existing) {
          // Se o usuário iniciou (eventPlayCount > 0), contar como usuário que iniciou
          if (curr.eventPlayCount > 0) {
            existing.usersPlayCount += 1;
          }
          // Se o usuário completou (eventCompleteCount > 0), contar como usuário que completou
          if (curr.eventCompleteCount > 0) {
            existing.usersCompleteCount += 1;
          }
          // Somar tempo total de reprodução
          existing.eventTotalPlaybackTime += curr.eventPlaybackTime;
        } else {
          acc.push({
            videoId: curr.videoId,
            videoTitle: curr.videoTitle,
            pagePath: curr.pagePath,
            videoDurationInSeconds: curr.videoDurationInSeconds,
            // Quantidade de pessoas que iniciaram
            usersPlayCount: curr.eventPlayCount > 0 ? 1 : 0,
            // Quantidade de pessoas que concluíram
            usersCompleteCount: curr.eventCompleteCount > 0 ? 1 : 0,
            // Tempo total de reprodução
            eventTotalPlaybackTime: curr.eventPlaybackTime,
          });
        }

        return acc;
      },
      [] as {
        videoId: string;
        videoTitle: string;
        pagePath: string;
        videoDurationInSeconds: number;
        usersPlayCount: number;
        usersCompleteCount: number;
        eventTotalPlaybackTime: number;
      }[],
    )
    // Adicionar tempo médio de reprodução
    .map((item) => ({
      ...item,
      eventAveragePlaybackTime:
        item.usersPlayCount > 0 ? Math.round(item.eventTotalPlaybackTime / item.usersPlayCount) : 0,
    }))
    .sort((a, b) => b.usersCompleteCount - a.usersCompleteCount);

  return (
    <div className="h-120 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" xAxisId="videoId" />
          {/* dataKey precisa ser único (videoId) para o Tooltip casar com a linha correta; vídeos com títulos repetidos faziam o Tooltip mostrar os dados do primeiro vídeo com o mesmo título */}
          <YAxis
            dataKey="videoId"
            type="category"
            width={190}
            tickFormatter={(videoId) =>
              data.find((item) => item.videoId === videoId)?.videoTitle ?? videoId
            }
          />
          <Tooltip
            labelFormatter={(videoId) =>
              data.find((item) => item.videoId === videoId)?.videoTitle ?? videoId
            }
          />
          <Legend />
          <Bar
            xAxisId="videoId"
            dataKey="usersPlayCount"
            fill="#3b82f6"
            name="Pessoas que Iniciaram"
          />
          <Bar
            xAxisId="videoId"
            dataKey="usersCompleteCount"
            fill="#ef4444"
            name="Pessoas que Concluíram"
          />
          <Bar
            xAxisId="videoId"
            dataKey="eventAveragePlaybackTime"
            fill="#10b981"
            name="Tempo Médio (s)"
          />
          <Bar
            xAxisId="videoId"
            dataKey="eventTotalPlaybackTime"
            fill="#8b5cf6"
            name="Tempo Total (s)"
          />
          <Bar
            xAxisId="videoId"
            dataKey="videoDurationInSeconds"
            fill="#f59e0b"
            name="Duração do Vídeo (s)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
