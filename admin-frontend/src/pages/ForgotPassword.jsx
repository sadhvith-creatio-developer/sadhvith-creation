import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, RotateCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../utils/usePageTitle";
import { config } from "../config";

export default function ForgotPassword() {
  usePageTitle("Forgot Password");
  const { forgotPasswordSendOtp, forgotPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required.");

    setSubmitting(true);
    try {
      const res = await forgotPasswordSendOtp(email.trim());
      setInfo(res.message);
      setStep("reset");
      setCooldown(45);
    } catch (err) {
      setError(err.message || "Could not send reset code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      const res = await forgotPasswordSendOtp(email.trim());
      setInfo(res.message);
      setCooldown(45);
    } catch (err) {
      setError(err.message || "Could not resend code.");
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");

    if (otp.trim().length !== 6) return setError("Enter the 6-digit code sent to your email.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmNewPassword) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      await forgotPasswordReset({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmNewPassword,
      });
      navigate("/login", { replace: true, state: { justResetPassword: true } });
    } catch (err) {
      setError(err.message || "Could not reset password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card-brand">
          <span className="admin-sidebar-mark" aria-hidden="true" />
          {config.brandName}
        </div>

        {step === "email" ? (
          <>
            <h1>Forgot Password</h1>
            <p className="muted">Enter your email and we'll send you a reset code.</p>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSendOtp} noValidate>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? "Sending code..." : "Send Reset Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Reset Password</h1>
            <p className="muted">
              Enter the code sent to <strong>{email}</strong> and choose a new password.
            </p>

            {error && <div className="form-error">{error}</div>}
            {info && !error && <div className="form-success">{info}</div>}

            <form onSubmit={handleReset} noValidate>
              <div className="form-field">
                <label htmlFor="otp">Reset Code</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoComplete="one-time-code"
                  placeholder="000000"
                  style={{ letterSpacing: "0.3em", fontWeight: 600, textAlign: "center" }}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                <KeyRound size={16} />
                {submitting ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={handleResend}
                disabled={cooldown > 0}
                style={{ marginTop: "10px" }}
              >
                <RotateCw size={14} />
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code"}
              </button>
            </form>
          </>
        )}

        <p className="auth-card-footer">
          Remembered your password? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
