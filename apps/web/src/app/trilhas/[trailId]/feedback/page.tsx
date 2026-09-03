import type { PaginatedFeedbackFormsResponse, Result } from "@/packages/schemas/index";

const fetchData = async (): Promise<Result<PaginatedFeedbackFormsResponse>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/feedback-forms/feedback-form-global-trail`, {
      cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-cache",
      next: { revalidate: 24 * 60 * 60 }, // 24 hours
    });
    if (!response.ok) throw new Error("Failed to fetch form");
    const data = await response.json();
    return data as Result<PaginatedFeedbackFormsResponse>;
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

export default async function PageForm() {
  const fetchedData = await fetchData();
  return <pre>{JSON.stringify(fetchedData, null, 2)}</pre>;
}
