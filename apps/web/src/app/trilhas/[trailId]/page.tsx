import { Result, Trail } from "@/packages/schemas";
import { TrilhaDetail } from "./components/trilha-detail";

const fetchData = async (trailId: string): Promise<Result<Trail>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/trails/${trailId}`, {
      cache: "force-cache",
      next: { revalidate: 24 * 60 * 60 }, // 24 hours
    });
    if (!response.ok) throw new Error("Failed to fetch trilha");
    const data = await response.json();
    return data as Result<Trail>;
  } catch (error) {
    console.error("Error fetching trilha:", error);
    return {
      success: false,
      message: "Failed to fetch trilha",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

export default async function TrilhaPage({ params }: { params: Promise<{ trailId: string }> }) {
  const { trailId } = await params;
  const fetchedData = await fetchData(trailId);

  if (!fetchedData.success || !fetchedData.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1E1E1E] font-sans">
        <p className="text-base text-[#F1F5F9]">Não foi possível carregar a trilha.</p>
      </main>
    );
  }

  return <TrilhaDetail trail={fetchedData.data} />;
}
