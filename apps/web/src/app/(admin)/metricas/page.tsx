import { apiGet } from "@/lib/api-client";
import {
  AnalyticsEvent,
  FeedbackForm,
  FeedbackResponse,
  ListVideosQuery,
  PaginatedVideos,
} from "@acervo/schemas";
import { MetricasDetails } from "./components/metricas-details";

const fetchAnalyticsData = () => apiGet<AnalyticsEvent[]>("/api/analytics");

const fetchVideosData = () => {
  const params = { page: 1, pageSize: 100 } as ListVideosQuery;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryString = new URLSearchParams(params as any).toString();
  return apiGet<PaginatedVideos>(`/api/videos?${queryString}`);
};

const fetchFeedbackFormData = () =>
  apiGet<FeedbackForm>("/api/feedback-forms/feedback-form-global-trail");

const fetchFeedbackResponsesData = () =>
  apiGet<FeedbackResponse[]>("/api/feedback-forms/feedback-form-global-trail/responses");

export default async function MetricasPage() {
  const [analyticsData, videosData, feedbackFormData, feedbackResponsesData] = await Promise.all([
    fetchAnalyticsData(),
    fetchVideosData(),
    fetchFeedbackFormData(),
    fetchFeedbackResponsesData(),
  ]);

  if (!analyticsData.success || !analyticsData.data) {
    console.error("Analytics data fetch failed:", analyticsData);
  }
  if (!videosData.success || !videosData.data) {
    console.error("Videos data fetch failed:", videosData);
  }
  if (!feedbackFormData.success || !feedbackFormData.data) {
    console.error("FeedbackForm data fetch failed:", feedbackFormData);
  }
  if (!feedbackResponsesData.success || !feedbackResponsesData.data) {
    console.error("FeedbackResponses data fetch failed:", feedbackResponsesData);
  }

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

  if (!videosData.success || !videosData.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground mt-2">Análise de eventos de analytics</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Erro ao carregar dados de vídeos</p>
        </div>
      </div>
    );
  }

  if (!feedbackFormData.success || !feedbackFormData.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground mt-2">Análise de eventos de analytics</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Erro ao carregar dados de FeedbackForm</p>
        </div>
      </div>
    );
  }

  if (!feedbackResponsesData.success || !feedbackResponsesData.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
          <p className="text-muted-foreground mt-2">Análise de eventos de analytics</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Erro ao carregar dados de FeedbackResponses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-3xl font-bold">Métricas</h1>
        <p className="text-muted-foreground text-center">
          Visualize padrões de engajamento dos usuários, análise de cliques e acesso às páginas.
        </p>
      </div>

      <MetricasDetails
        events={analyticsData.data}
        videos={videosData.data.items}
        feedbackForm={feedbackFormData.data}
        feedbackResponses={feedbackResponsesData.data}
      />
    </div>
  );
}
