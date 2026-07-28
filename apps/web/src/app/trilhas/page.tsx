const fetchData = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/api/trails`);

    if (!response.ok) throw new Error("Failed to fetch trilhas");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching trilhas:", error);
    return [];
  }
};

export default async function PageTrilhas() {
  const fetchedData = await fetchData();
  return <pre>{JSON.stringify(fetchedData, null, 2)}</pre>;
}
