import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, getToken, setToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.me();
        if (!cancelled) setAdmin(res.account);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    setToken(res.token);
    setAdmin(res.account);
    return res.account;
  }, []);

  // Step 1 of registration: submit details, an OTP is emailed.
  const registerSendOtp = useCallback(async (payload) => {
    return authApi.registerSendOtp(payload);
  }, []);

  const registerResendOtp = useCallback(async (email) => {
    return authApi.registerResendOtp(email);
  }, []);

  // Step 2 of registration: submit the OTP, account is created and logged in.
  const registerVerifyOtp = useCallback(async (email, otp) => {
    const res = await authApi.registerVerifyOtp(email, otp);
    setToken(res.token);
    setAdmin(res.account);
    return res.account;
  }, []);

  const forgotPasswordSendOtp = useCallback(async (email) => {
    return authApi.forgotPasswordSendOtp(email);
  }, []);

  const forgotPasswordReset = useCallback(async (payload) => {
    return authApi.forgotPasswordReset(payload);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    authApi.logout().catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        registerSendOtp,
        registerResendOtp,
        registerVerifyOtp,
        forgotPasswordSendOtp,
        forgotPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
