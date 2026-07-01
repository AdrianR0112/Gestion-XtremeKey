import { apiRequest } from "@/lib/api";
import type { AuthFormData } from "@/modules/auth/auth.types";

type SessionResponse = {
  ok: boolean;
  message: string;
  data: {
    user: {
      id: string;
      authUserId: string;
      name: string;
      email: string;
      role: string;
      company?: string;
    };
  };
};

export const authApi = {
  async login(data: AuthFormData) {
    const response = await apiRequest<SessionResponse>("/customer-auth/login", {
      method: "POST",
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return response.data.user;
  },
  async register(data: AuthFormData) {
    const response = await apiRequest<SessionResponse>("/customer-auth/register", {
      method: "POST",
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return response.data.user;
  },
  async getSession() {
    const response = await apiRequest<SessionResponse>("/customer-auth/session", {
      method: "GET",
    });

    return response.data.user;
  },
  async logout() {
    await apiRequest<{ ok: boolean }>("/customer-auth/logout", {
      method: "POST",
    });
  },
};
