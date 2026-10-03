import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const authApi = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  // ==========================
  // REGISTER
  // ==========================
  register: async (data) => {
    try {
      const response = await authApi.post("/api/auth/register", {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  },

  // ==========================
  // LOGIN
  // ==========================
  login: async (data) => {
    try {
      const response = await authApi.post("/api/auth/login", {
        identifier: data.identifier,
        password: data.password,
        role: data.role,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  },
};

export default authService;