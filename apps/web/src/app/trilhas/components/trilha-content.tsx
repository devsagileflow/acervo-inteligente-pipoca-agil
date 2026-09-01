import type { Trail } from "@/packages/schemas/trail.api.schema";

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h${minutes.toString().padStart(2, "0")}` : `${minutes}min`;
};

export const getTrailStats = (trilha: Trail) => {
  const items = trilha.items ?? [];
  const videosCount = items.length;
  const totalSeconds = items.reduce((sum, item) => sum + (item.content?.durationInSeconds ?? 0), 0);

  return {
    videosCount,
    durationLabel: totalSeconds > 0 ? `${formatDuration(totalSeconds)} de duração` : "",
  };
};
