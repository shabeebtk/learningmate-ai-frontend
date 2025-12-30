import { NextResponse } from "next/server";
import { BACKEND_API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token found" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_API_URL}/user/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await res.json();

    if (data?.success && data?.data?.access_token) {
      const newAccessToken = data.data.access_token;
      const decoded: any = jwtDecode(newAccessToken);

      const response = NextResponse.json({
        success: true,
        message: "Access token refreshed successfully",
      });

      response.cookies.set({
        name: ACCESS_TOKEN_KEY,
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(decoded.exp * 1000),
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Failed to refresh token", data },
      { status: res.status }
    );
  } catch (err: any) {
    console.error("Refresh token error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to refresh token" },
      { status: 500 }
    );
  }
}
