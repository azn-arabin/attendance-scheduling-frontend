import axios from "axios";

const MAIN_API = axios.create({
  baseURL: `${import.meta.env.VITE_API_ENDPOINT}/api`,
});

MAIN_API.interceptors.request.use(
  (config) => {
    const data = JSON.parse(localStorage.getItem("auth") as any);

    // Check if jwt and accessToken are valid before adding to header
    config.headers["Authorization"] = `Bearer ${data?.access_token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface PaginationType {
  page: number;
  pageSize: number;
}

export { MAIN_API };
