'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleCallback from "@/components/AuthModal/GoogleAuth";

export default function GoogleCallbackPage() {
  return (
    <GoogleCallback/>
  );
}
