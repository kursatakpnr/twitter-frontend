import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const extractApiError = (error, fallbackMessage = "Request failed.") => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    if (Array.isArray(responseData?.fieldErrors) && responseData.fieldErrors.length > 0) {
      return responseData.fieldErrors
        .map((item) => `${item.field}: ${item.message}`)
        .join(" | ");
    }
    if (typeof responseData?.message === "string") {
      return responseData.message;
    }
    if (typeof error.message === "string") {
      return error.message;
    }
  }
  return fallbackMessage;
};

export default http;
