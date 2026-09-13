// Central API client for the FastAPI backend. No component should ever
// call fetch("http://...") directly — everything goes through here, so
// the base URL, auth header, and error handling only live in one place.
//
// This is the ADMIN dashboard — it has full access: the same product
// management endpoints the manager dashboard uses, PLUS admin-only
// endpoints for managing manager accounts and an admin-wide dashboard.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "sadhvith_admin_token";

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
// All admin auth endpoints live under /auth/admin/...
export const authApi = {
  registerSendOtp: (payload) => request("/auth/admin/register/send-otp", { method: "POST", body: payload }),
  registerResendOtp: (email) => request("/auth/admin/register/resend-otp", { method: "POST", body: { email } }),
  registerVerifyOtp: (email, otp) =>
    request("/auth/admin/register/verify-otp", { method: "POST", body: { email, otp } }),
  login: (payload) => request("/auth/admin/login", { method: "POST", body: payload }),
  me: () => request("/auth/admin/me", { auth: true }),
  logout: () => request("/auth/admin/logout", { method: "POST", auth: true }),
  forgotPasswordSendOtp: (email) =>
    request("/auth/admin/forgot-password/send-otp", { method: "POST", body: { email } }),
  forgotPasswordReset: (payload) =>
    request("/auth/admin/forgot-password/reset", { method: "POST", body: payload }),
};

// ---- Product management (admin has the same full access as manager) ----
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

// ---- Admin-only: dashboard + manager account management ----
export const adminApi = {
  dashboard: () => request("/admin/dashboard", { auth: true }),
  listManagers: () => request("/admin/managers", { auth: true }),
  setManagerStatus: (id, isActive) =>
    request(`/admin/managers/${id}/status`, { method: "PATCH", body: { isActive }, auth: true }),
  removeManager: (id) => request(`/admin/managers/${id}`, { method: "DELETE", auth: true }),
  listAdmins: () => request("/admin/admins", { auth: true }),
};

export { ApiError };
