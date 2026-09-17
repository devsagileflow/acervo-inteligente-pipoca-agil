import {
  AnalyticsEvent,
  FeedbackForm,
  FeedbackResponse,
  ListVideosQuery,
  PaginatedVideos,
  Result,
} from "@/packages/schemas";
import { MetricasDetails } from "./components/metricas-details";

const fetchAnalyticsData = async (): Promise<Result<AnalyticsEvent[]>> => {
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
    return {
      success: false,
      message: "Failed to fetch analytics",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

const fetchVideosData = async (): Promise<Result<PaginatedVideos>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = { page: 1, pageSize: 100 } as ListVideosQuery;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryString = new URLSearchParams(params as any).toString();
    const Url = `${baseUrl}/api/videos?${queryString}`;
    const response = await fetch(Url, {
      // cache: "force-cache",
      // next: { revalidate: 1 * 60 * 60 }, // 1 hour
    });
    if (!response.ok) throw new Error("Failed to fetch videos");
    const data = await response.json();
    return data as Result<PaginatedVideos>;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch videos",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

const fetchFeedbackFormData = async (): Promise<Result<FeedbackForm>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/feedback-forms/feedback-form-global-trail`, {
      // cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
      // next: { revalidate: 24 * 60 * 60 }, // 24 hours
    });
    if (!response.ok) throw new Error("Failed to fetch form");
    const data = await response.json();
    return data as Result<FeedbackForm>;
  } catch (error) {
    console.error("Error fetching form:", error);
    return {
      success: false,
      message: "Failed to fetch form",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

const fetchFeedbackResponsesData = async (): Promise<Result<FeedbackResponse[]>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${baseUrl}/api/feedback-forms/feedback-form-global-trail/responses`,
      {
        // cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
        // next: { revalidate: 24 * 60 * 60 }, // 24 hours
      },
    );
    if (!response.ok) throw new Error("Failed to fetch form responses");
    const data = await response.json();
    return data as Result<FeedbackResponse[]>;
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return {
      success: false,
      message: "Failed to fetch form responses",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

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
