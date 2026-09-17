import { AnalyticsEvent, Result } from "@/packages/schemas";
import { MetricasDetails } from "./components/metricas-details";

const fetchData = async (): Promise<Result<AnalyticsEvent[]>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/analytics`, {
      // cache: "force-cache",
      // next: { revalidate: 1 * 60 * 60 }, // 1 hour
    });
    if (!response.ok) throw new Error("Failed to fetch analytics");
    const data = await response.json();
    return data as Result<AnalyticsEvent[]>;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      message: "Failed to fetch analytics",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

export default async function MetricasPage() {
  const analyticsData = await fetchData();

  if (!analyticsData.success || !analyticsData.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground mt-2">Análise de eventos de analytics</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Erro ao carregar dados de analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
        <p className="text-muted-foreground mt-2">
          Visualize padrões de engajamento dos usuários, análise de cliques e acesso às páginas.
        </p>
      </div>

      {/* Content */}
      <MetricasDetails events={analyticsData.data} />
    </div>
  );
}
