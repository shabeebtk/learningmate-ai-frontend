'use client';
import { useState } from "react";
import { X, Mail, Lock, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { userLogin, userSignUp, verifyOtp, getGoogleLoginUrl } from "./api";
import { useAuth } from "@/app/hooks/useAuth";
import styles from "./index.module.css";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { setUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setOtp("");
    setShowOtp(false);
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await userLogin({ email, password });

      if (data.success) {
        if (data.data?.verification_required) {
          setShowOtp(true);
          setSuccess("OTP sent to your email!");
        } else {
          setSuccess("Login successful!");
          // Fetch user details
          const userRes = await fetch("/api/user/details");
          const userData = await userRes.json();
          if (userData.success) {
            setUser(userData.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await userSignUp({ email, password });

      if (data.success) {
        if (data.data?.verification_required) {
          setShowOtp(true);
          setSuccess("Account created! OTP sent to your email.");
        } else {
          setSuccess("Signup successful!");
          // Fetch user details
          const userRes = await fetch("/api/user/details");
          const userData = await userRes.json();
          if (userData.success) {
            setUser(userData.data);
          }
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await verifyOtp({ email, otp });

      if (data.success) {
        setSuccess("Verification successful!");
        // Fetch user details
        const userRes = await fetch("/api/user/details");
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
        }
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setSuccess("");
    setShowOtp(false);
    setOtp("");
  };


  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
          <X />
        </button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {showOtp ? "Verify OTP" : mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className={styles.modalSubtitle}>
            {showOtp
              ? "Enter the verification code sent to your email"
              : mode === "login"
                ? "Sign in to continue your learning journey"
                : "Start your learning adventure today"}
          </p>
        </div>

        {error && (
          <div className={styles.alert} data-type="error">
            <AlertCircle className={styles.alertIcon} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.alert} data-type="success">
            <CheckCircle2 className={styles.alertIcon} />
            <span>{success}</span>
          </div>
        )}

        {!showOtp ? (
          <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{mode === "login" ? "Sign In" : "Sign Up"}</>
              )}
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={async () => {
                try {
                  const data = await getGoogleLoginUrl();
                  if (data?.data?.auth_url) {
                    window.location.href = data.data.auth_url;
                  } else {
                    console.error("Google auth URL missing in response");
                  }
                } catch (err) {
                  console.error("Failed to get Google login URL:", err);
                }
              }}
            >
              <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt="Google" className={styles.googleIcon} />
              Continue with Google
            </button>

            <button type="button" onClick={switchMode} className={styles.switchBtn}>
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Verification Code</label>
              <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={styles.input}
                  disabled={loading}
                  maxLength={6}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} />
                  Verifying...
                </>
              ) : (
                <>Verify & Continue</>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setOtp("");
                setError("");
                setSuccess("");
              }}
              className={styles.backBtn}
            >
              Back to {mode === "login" ? "login" : "signup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}