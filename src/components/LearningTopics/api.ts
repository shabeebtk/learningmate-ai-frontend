export async function fetchTopics(
  limit = 20,
  offset = 0,
  search = "",
  category = ""
) {
  try {
    const url = `/api/learn/topics/list?limit=${limit}&offset=${offset}&search=${encodeURIComponent(
      search
    )}&category=${encodeURIComponent(category)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to load topics");

    return data.data; // { count, next_offset, data: [...] }
  } catch (err: any) {
    console.error("Topic fetch failed:", err);
    return { count: 0, next_offset: null, data: [] };
  }
}


export async function fetchCategories(limit = 20, offset = 0, search = "") {
  const res = await fetch(`/api/learn/categories/list?limit=${limit}&offset=${offset}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data;
}
