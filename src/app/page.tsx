'use client';

import { useAuth } from "./hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, authenticating, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // get refresh token from cookies
      const refresh = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh_token="))
        ?.split("=")[1];

      // delete cookies (both access + refresh)
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // reset user context
      setUser(null);

      // redirect
      router.push("/register");
    } catch (err) {
      console.error("Logout failed", err);
      router.push("/register");
    }
  };

  if (authenticating) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>HOME PAGE</h1>
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <div>
            <img
              src={user.profile_img ? user.profile_img : ""}
              alt="image"
              className="w-20 h-20 rounded-full border"
            />
          </div>
          <p>Username: {user.username}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Verified: {user.is_verified ? "Yes" : "No"}</p>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <p>User not logged in</p>

          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
