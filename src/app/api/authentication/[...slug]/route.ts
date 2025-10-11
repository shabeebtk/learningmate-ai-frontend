import { NextResponse } from "next/server";
import { BACKEND_API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants"
import { jwtDecode } from "jwt-decode";

type RequestMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handler(request: Request, method: RequestMethods, params: { slug: string[] }) {
  try {
    const backendPath = params.slug.join("/"); // e.g. "user/login"
    const uriParams = new URL(request.url).searchParams.toString();

    const fullUrl = uriParams
      ? `${BACKEND_API_URL}/${backendPath}?${uriParams}`
      : `${BACKEND_API_URL}/${backendPath}`;

    const requestBody = method !== "GET" ? await request.json().catch(() => undefined) : undefined;

    const res = await fetch(fullUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    const data = await res.json();

    const response = NextResponse.json(data, { status: res.status });

    // If login/signup returns tokens, set cookies
    if (data?.data?.access && data?.data?.refresh) {
      const decodedAccessToken: any = jwtDecode(data.data.access);
      const decodedRefreshToken: any = jwtDecode(data.data.refresh);

      // Set cookies using NextResponse
      response.cookies.set({
        name: ACCESS_TOKEN_KEY,
        value: data.data.access,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(decodedAccessToken.exp * 1000),
      });

      response.cookies.set({
        name: REFRESH_TOKEN_KEY,
        value: data.data.refresh,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(decodedRefreshToken.exp * 1000),
      });
    }

    return response;
  } catch (err: any) {
    console.error("Error forwarding request:", err);
    return NextResponse.json({ error: err?.message || "Failed request" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  return handler(request, "GET", params);
}
export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  return handler(request, "POST", params);
}
export async function PUT(request: Request, { params }: { params: { slug: string[] } }) {
  return handler(request, "PUT", params);
}
export async function PATCH(request: Request, { params }: { params: { slug: string[] } }) {
  return handler(request, "PATCH", params);
}
export async function DELETE(request: Request, { params }: { params: { slug: string[] } }) {
  return handler(request, "DELETE", params);
}
