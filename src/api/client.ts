import type {
  HomeData,
  ExperienceData,
  ExpertiseData,
  AchievementData,
  Project,
  ContactPayload,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "admin-api-token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Friendly message for toasts, including the first Laravel validation error. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const first = err.errors ? Object.values(err.errors)[0]?.[0] : undefined;
    return first ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
}

const needsAuth = (path: string) => path.startsWith("/admin") || path === "/logout";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = needsAuth(path) ? tokenStore.get() : null;
  const isForm = typeof FormData !== "undefined" && init?.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      // For FormData the browser sets the multipart boundary itself.
      ...(init?.body && !isForm ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 401 && token) {
    tokenStore.clear();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      body?.message ?? `Request to ${path} failed (${res.status})`,
      res.status,
      body?.errors,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getHome: () => request<HomeData>("/home"),
  getExperiences: () => request<ExperienceData>("/experiences"),
  getExpertise: () => request<ExpertiseData>("/expertise"),
  getAchievements: () => request<AchievementData>("/achievements"),
  getProjects: (type?: Project["type"]) =>
    request<{ data: Project[] }>(`/projects${type ? `?type=${type}` : ""}`),
  getProject: (slug: string) => request<{ data: Project }>(`/projects/${slug}`),
  sendContactMessage: (payload: ContactPayload) =>
    request<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};