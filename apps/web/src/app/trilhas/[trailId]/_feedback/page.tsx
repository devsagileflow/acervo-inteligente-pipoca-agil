import { apiGet } from "@/lib/api-client";
import type { FeedbackForm } from "@acervo/schemas";
import { RenderAPIForm } from "./components/renderAPIForm";

type Props = {
  params: Promise<{ trailId: string }>;
};

export default async function PageForm({ params }: Props) {
  const { trailId } = await params;
  const fetchedData = await apiGet<FeedbackForm>("/api/feedback-forms/feedback-form-global-trail", {
    cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
    next: { revalidate: 24 * 60 * 60 }, // 24 hours
  });

  if (!fetchedData.success || !fetchedData.data)
    return (
      <div>
        <p>Failed to fetch feedback form: {fetchedData.message}</p>
      </div>
    );

  return (
    <div className="flex justify-center bg-[#0F172A] px-14">
      <RenderAPIForm
        feedback_form={fetchedData.data}
        contentType="TRAIL"
        contentId={trailId}
        onClose={() => {}}
      />
    </div>
  );
}
