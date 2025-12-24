import { useAuthStore } from "@/store/authStore";

const BASE_URL = "https://qa82pg67bj.execute-api.ap-south-1.amazonaws.com/dev";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiClient = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  // Get the access token from the store (this works even outside components because it's Zustand)
  const token = useAuthStore.getState().accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Interceptor logic for error handling
    if (response.status === 413 || response.status === 401) {
      // Auto logout on 413 (as requested) or 401 (Unauthorized)
      useAuthStore.getState().logout();

      // Redirect to login page
      // Requires window object check since this might run on server
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("Session expired or invalid"));
    }

    if (!response.ok) {
      // Try to parse error message from body
      try {
        const errorData = await response.json();
        return Promise.reject(
          new Error(errorData.message || `Error ${response.status}`)
        );
      } catch (e) {
        return Promise.reject(new Error(`HTTP Error ${response.status}`));
      }
    }

    // Attempt to return JSON, else text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    throw error;
  }
};
