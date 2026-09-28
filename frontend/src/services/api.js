export const API_BASE_URL = "http://localhost:5000/api";

export const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
