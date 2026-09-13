// Central API client for the FastAPI backend. No component should ever
// call fetch("http://...") directly — everything goes through here, so
// the base URL, auth header, and error handling only live in one place.
//
// This is the MANAGER dashboard — it calls both the public product
// endpoints (for the "view live" links) and the protected manager/auth
// endpoints, always attaching the JWT bearer token when required.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "sadhvith_manager_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body (e.g. a network-level failure page) — fall through.
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      setToken(null);
    }
    const message = data?.message || `Request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return data;
}

// ---- Auth (OTP-verified registration, login, forgot password) ----
// All manager auth endpoints live under /auth/manager/...
export const authApi = {
  registerSendOtp: (payload) => request("/auth/manager/register/send-otp", { method: "POST", body: payload }),
  registerResendOtp: (email) => request("/auth/manager/register/resend-otp", { method: "POST", body: { email } }),
  registerVerifyOtp: (email, otp) =>
    request("/auth/manager/register/verify-otp", { method: "POST", body: { email, otp } }),
  login: (payload) => request("/auth/manager/login", { method: "POST", body: payload }),
  me: () => request("/auth/manager/me", { auth: true }),
  logout: () => request("/auth/manager/logout", { method: "POST", auth: true }),
  forgotPasswordSendOtp: (email) =>
    request("/auth/manager/forgot-password/send-otp", { method: "POST", body: { email } }),
  forgotPasswordReset: (payload) =>
    request("/auth/manager/forgot-password/reset", { method: "POST", body: payload }),
};

// ---- Manager product management ----
export const managerProductsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    return request(`/products/manager/all${query ? `?${query}` : ""}`, { auth: true });
  },
  create: (formData) => request("/products", { method: "POST", body: formData, isForm: true, auth: true }),
  update: (id, formData) =>
    request(`/products/${id}`, { method: "PUT", body: formData, isForm: true, auth: true }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE", auth: true }),
};

export const managerApi = {
  dashboard: () => request("/manager/dashboard", { auth: true }),
};

export { ApiError };
