import { TrilhasContent } from "./components/trilhas-card";
import type { PaginatedTrails, Result } from "@/packages/schemas/index";

const fetchData = async (): Promise<Result<PaginatedTrails>> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/trails`, {
      cache: "force-cache",
      next: { revalidate: 24 * 60 * 60 }, // 24 hours
    });
    if (!response.ok) throw new Error("Failed to fetch trilhas");
    const data = await response.json();
    return data as Result<PaginatedTrails>;
  } catch (error) {
    console.error("Error fetching trilhas:", error);
    return {
      success: false,
      message: "Failed to fetch trilhas",
      code: 500,
      error: { errors: [error instanceof Error ? error.message : "Unknown error"] },
    };
  }
};

export default async function PageTrilhas() {
  const fetchedData = await fetchData();

  if (!fetchedData.success)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Erro ao carregar trilhas</h1>
        <p className="text-gray-600">{fetchedData.message}</p>
      </div>
    );

  return <TrilhasContent trilhas={fetchedData.data?.items || []} />;
}
