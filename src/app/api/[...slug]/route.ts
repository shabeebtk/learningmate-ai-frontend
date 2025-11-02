import { NextResponse } from "next/server";
import { BACKEND_API_URL, ACCESS_TOKEN_KEY } from "@/constants";
import { cookies } from "next/headers";

type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handler(request: Request, method: Methods, params: { slug: string[] }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

    const backendPath = params.slug.join("/");
    const uriParams = new URL(request.url).searchParams.toString();

    const targetUrl = uriParams
      ? `${BACKEND_API_URL}/${backendPath}?${uriParams}`
      : `${BACKEND_API_URL}/${backendPath}`;

    const requestBody = method !== "GET" ? await request.json().catch(() => undefined) : undefined;

    const res = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    // Handle 401 from backend → redirect user to /register
    if (res.status === 401) {
      const redirectResponse = NextResponse.redirect(new URL("/register", request.url));
      redirectResponse.cookies.delete(ACCESS_TOKEN_KEY);
      return redirectResponse;
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Backend proxy error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, "GET", params);
}
export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, "POST", params);
}
export async function PUT(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, "PUT", params);
}
export async function PATCH(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, "PATCH", params);
}
export async function DELETE(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, "DELETE", params);
}
