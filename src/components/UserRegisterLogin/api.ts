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