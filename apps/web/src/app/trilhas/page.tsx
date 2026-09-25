import { apiGet } from "@/lib/api-client";
import type { PaginatedTrails } from "@acervo/schemas";
import { TrilhasContent } from "./components/trilhas-card";

export default async function PageTrilhas() {
  const fetchedData = await apiGet<PaginatedTrails>("/api/trails", {
    cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
    next: { revalidate: 24 * 60 * 60 }, // 24 hours
  });

  if (!fetchedData.success)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Erro ao carregar trilhas</h1>
        <p className="text-gray-600">{fetchedData.message}</p>
      </div>
    );

  return <TrilhasContent trilhas={fetchedData.data?.items || []} />;
}
