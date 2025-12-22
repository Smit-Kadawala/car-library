import axios from "axios";

// Get base URL from env or fallback
const BASE_URL = "https://cars-mock-api-new-6e7a623e6570.herokuapp.com";

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (runs before every request)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (runs after every response)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
