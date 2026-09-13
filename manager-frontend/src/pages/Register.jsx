import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShieldCheck, RotateCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../utils/usePageTitle";
import { config } from "../config";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function Register() {
  usePageTitle("Manager Registration");
  const { registerSendOtp, registerVerifyOtp, registerResendOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("details"); // "details" | "otp"
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim()) return setError("Email is required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      const res = await registerSendOtp(form);
      setInfo(res.message);
      setStep("otp");
      setCooldown(45);
    } catch (err) {
      setError(err.message || "Could not send verification code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    if (otp.trim().length !== 6) return setError("Enter the 6-digit code sent to your email.");

    setSubmitting(true);
    try {
      await registerVerifyOtp(form.email, otp.trim());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    try {
      const res = await registerResendOtp(form.email);
      setInfo(res.message);
      setCooldown(45);
    } catch (err) {
      setError(err.message || "Could not resend code.");
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-card-brand">
          <span className="admin-sidebar-mark" aria-hidden="true" />
          {config.brandName}
        </div>

        {step === "details" ? (
          <>
            <h1>Manager Registration</h1>
            <p className="muted">Create an account to manage the product catalogue.</p>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSendOtp} noValidate>
              <div className="form-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                <UserPlus size={16} />
                {submitting ? "Sending code..." : "Send Verification Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Verify Your Email</h1>
            <p className="muted">
              Enter the 6-digit code sent to <strong>{form.email}</strong>.
            </p>

            {error && <div className="form-error">{error}</div>}
            {info && !error && <div className="form-success">{info}</div>}

            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="form-field">
                <label htmlFor="otp">Verification Code</label>
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

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                <ShieldCheck size={16} />
                {submitting ? "Verifying..." : "Verify & Create Account"}
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

            <p className="auth-card-footer">
              Entered the wrong email?{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError("");
                  setInfo("");
                }}
              >
                Go back
              </button>
            </p>
          </>
        )}

        {step === "details" && (
          <p className="auth-card-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
