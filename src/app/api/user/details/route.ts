import { NextResponse } from "next/server";
import { BACKEND_API_URL, ACCESS_TOKEN_KEY } from "@/constants";
import { cookies } from "next/headers"; // correct import

export async function GET() {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_API_URL}/user/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed" },
      { status: 500 }
    );
  }
}
