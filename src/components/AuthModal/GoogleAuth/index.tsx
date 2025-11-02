'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGoogleCallback } from "../api";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    
    // If no code, redirect immediately
    if (!code) {
      router.replace("/learn/categories");
      return;
    }

    (async () => {
      try {
        const data = await handleGoogleCallback(code);
        
        // Success or failure, redirect to categories
        window.location.href = "/learn/categories";
      } catch (err) {
        console.error("Google callback error:", err);
        // Redirect on error too
        router.replace("/learn/categories");
      }
    })();
  }, [searchParams, router]);

  // Return null to show nothing
  return null;
}