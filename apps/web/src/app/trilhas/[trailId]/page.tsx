import { apiGet } from "@/lib/api-client";
import type { Trail } from "@acervo/schemas";
import { TrilhaDetail } from "./components/trilha-detail";

export default async function TrilhaPage({ params }: { params: Promise<{ trailId: string }> }) {
  const { trailId } = await params;
  const fetchedData = await apiGet<Trail>(`/api/trails/${trailId}`, {
    cache: "force-cache",
    next: { revalidate: 24 * 60 * 60 }, // 24 hours
  });

  if (!fetchedData.success || !fetchedData.data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1E1E1E] font-sans">
        <p className="text-base text-[#F1F5F9]">Não foi possível carregar a trilha.</p>
      </main>
    );
  }

  return <TrilhaDetail trail={fetchedData.data} />;
}
