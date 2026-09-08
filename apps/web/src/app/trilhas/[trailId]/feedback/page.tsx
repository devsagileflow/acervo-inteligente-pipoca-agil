import type { FeedbackForm, Result } from "@/packages/schemas/index";
import { RenderAPIForm } from "./components/renderAPIForm";

const fetchData = async (): Promise<Result<FeedbackForm>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/feedback-forms/feedback-form-global-trail`, {
      cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
      next: { revalidate: 24 * 60 * 60 }, // 24 hours
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

type Props = {
  params: Promise<{ trailId: string }>;
};

export default async function PageForm({ params }: Props) {
  const { trailId } = await params;
  const fetchedData = await fetchData();

  if (!fetchedData.success || !fetchedData.data)
    return (
      <div>
        <p>Failed to fetch feedback form: {fetchedData.message}</p>
      </div>
    );

  return (
    <div className="bg-[#0F172A]">
      <RenderAPIForm feedback_form={fetchedData.data} content="TRAIL" contentId={trailId} />
    </div>
  );
}
