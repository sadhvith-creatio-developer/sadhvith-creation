const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
      0
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // No JSON body
  }

  if (!response.ok) {
    const message =
      data?.message || `Request failed (${response.status}).`;

    throw new ApiError(message, response.status);
  }

  return data;
}

export const productsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    ).toString();

    return request(`/products${query ? `?${query}` : ""}`);
  },

  getBySlug: (slug) =>
    request(`/products/${encodeURIComponent(slug)}`),
};

export { ApiError };