import { apiGet } from "@/lib/api-client";
import type { Trail, FeedbackForm } from "@acervo/schemas";
import { TrilhaDetail } from "./components/trilha-detail";

const fetchedTrailData = async (trailId: string) =>
  await apiGet<Trail>(`/api/trails/${trailId}`, {});

const fetchedFeedbackFormData = async () =>
  await apiGet<FeedbackForm>("/api/feedback-forms/feedback-form-global-trail");

export default async function TrilhaPage({ params }: { params: Promise<{ trailId: string }> }) {
  const { trailId } = await params;

  const [trailData, feedbackFormData] = await Promise.all([
    fetchedTrailData(trailId),
    fetchedFeedbackFormData(),
  ]);

  if (!trailData.success || !trailData.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1E1E1E] font-sans">
        <p className="text-base text-[#F1F5F9]">Não foi possível carregar a trilha.</p>
      </main>
    );
  }

  return <TrilhaDetail trail={trailData.data} feedbackForm={feedbackFormData.data} />;
}
