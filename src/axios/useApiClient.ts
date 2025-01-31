import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export function useApiClient() {
  const { getToken } = useAuth();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const instance = axios.create({
    baseURL: baseUrl,
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}
