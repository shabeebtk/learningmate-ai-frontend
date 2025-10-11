'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userLogin, userSignUp, verifyOtp } from "./api";

export default function UserRegisterLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleLogin = async () => {
    const data = await userLogin({ email, password });

    if (data.success) {
      if (data.data?.verification_required) {
        setShowOtp(true);
      } else {
        router.push("/");
      }
    } else {
      alert(data.message || "Login failed");
    }
  };

  const handleSignUp = async () => {
    const data = await userSignUp({ email, password });

    if (data.success) {
      if (data.data?.verification_required) {
        setShowOtp(true);
      } else {
        router.push("/");
      }
    } else {
      alert(data.message || "Signup failed");
    }
  };

  const handleVerifyOtp = async () => {
    const data = await verifyOtp({ email, otp });

    if (data.success) {
      router.push("/");
    } else {
      alert(data.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      {!showOtp && (
        <>
        <div className="flex gap-3">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignUp}>Signup</button>
          </div>
        </>
      )}

      {showOtp && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
