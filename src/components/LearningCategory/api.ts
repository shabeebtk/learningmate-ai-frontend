export async function fetchCategories(limit = 20, offset = 0, search = "") {
  try {
    const url = `/api/learn/categories/list?limit=${limit}&offset=${offset}&search=${encodeURIComponent(search)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed to load categories");

    return data.data; // returns { count, next_offset, data: [...] }
  } catch (err: any) {
    console.error("Category fetch failed:", err);
    return { count: 0, next_offset: null, data: [] };
  }
}
