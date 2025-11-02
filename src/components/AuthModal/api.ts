export async function userLogin(payload: { email: string; password: string }) {
  const res = await fetch("/api/authentication/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function userSignUp(payload: { email: string; password: string }) {
  const res = await fetch("/api/authentication/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function verifyOtp(payload: { email: string; otp: string }) {
  const res = await fetch("/api/authentication/user/verify/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getGoogleLoginUrl() {
  const res = await fetch("/api/authentication/user/auth/google/login/url", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Google login URL");
  }

  return res.json();
}


export async function handleGoogleCallback(code: string) {
  const res = await fetch(`/api/authentication/user/auth/google/callback?code=${code}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Callback request failed: ${res.status}`);
  }

  return res.json();
}
