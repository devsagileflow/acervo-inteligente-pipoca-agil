import type { Trail } from "@/packages/schemas/trail.api.schema";

export interface ParsedTrailDescription {
  summary: string;
  tags: string[];
  fichaTecnica: string | null;
}

const TAGS_MARKER = "Tags:";
const FICHA_MARKER = "Ficha técnica:";

export const parseTrailDescription = (
  description?: string | null,
): ParsedTrailDescription => {
  if (!description) return { summary: "", tags: [], fichaTecnica: null };

  const tagsIndex = description.indexOf(TAGS_MARKER);
  const fichaIndex = description.indexOf(FICHA_MARKER);

  const summary =
    tagsIndex >= 0 ? description.slice(0, tagsIndex).trim() : description.trim();

  const tagsBlock =
    tagsIndex >= 0
      ? description.slice(tagsIndex + TAGS_MARKER.length, fichaIndex >= 0 ? fichaIndex : undefined)
      : "";

  const tags = tagsBlock
    .replace(/\.$/, "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const fichaTecnica =
    fichaIndex >= 0 ? description.slice(fichaIndex + FICHA_MARKER.length).trim() : null;

  return { summary, tags, fichaTecnica };
};

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h${minutes.toString().padStart(2, "0")}` : `${minutes}min`;
};

export const getTrailStats = (trilha: Trail) => {
  const items = trilha.items ?? [];
  const videosCount = items.length;
  const totalSeconds = items.reduce(
    (sum, item) => sum + (item.content?.durationInSeconds ?? 0),
    0,
  );

  return {
    videosCount,
    durationLabel: totalSeconds > 0 ? `${formatDuration(totalSeconds)} de duração` : "",
  };
};