import { request } from "./client";
import type { Achievement, Experience, Profile, Project, SocialLink } from "./types";
import type { ContactMessage } from "./admin-types";

/** Laravel resources wrap payloads in { data }, plain arrays/objects don't. Accept both. */
export function unwrap<T>(body: unknown): T {
  if (body && typeof body === "object" && !Array.isArray(body) && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

/**
 * List endpoints may return a bare array, { data: [...] }, a paginator
 * { data: [...], meta }, a wrapped paginator { data: { data: [...] } }, or
 * { messages: [...] }. Find the array in any of those shapes.
 */
export function unwrapList<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (obj.data && typeof obj.data === "object") {
      const inner = unwrapList<T>(obj.data);
      if (inner.length || Array.isArray((obj.data as Record<string, unknown>).data)) return inner;
    }
    const firstArray = Object.values(obj).find(Array.isArray);
    if (firstArray) return firstArray as T[];
  }
  return [];
}

const send = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export interface Resource<T> {
  list: () => Promise<T[]>;
  create: (payload: unknown) => Promise<T>;
  update: (id: number, payload: unknown) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

function resource<T>(name: string): Resource<T> {
  return {
    list: async () => unwrapList<T>(await request<unknown>(`/admin/${name}`)),
    create: async (payload) => unwrap<T>(await request<unknown>(`/admin/${name}`, send("POST", payload))),
    update: async (id, payload) =>
      unwrap<T>(await request<unknown>(`/admin/${name}/${id}`, send("PUT", payload))),
    remove: (id) => request<void>(`/admin/${name}/${id}`, send("DELETE")),
  };
}

function extractToken(body: Record<string, unknown>): string | undefined {
  const nested = (body.data ?? {}) as Record<string, unknown>;
  return (body.token ?? body.access_token ?? nested.token ?? nested.access_token) as string | undefined;
}

export const adminApi = {
  // NOTE: /login and /logout aren't in the routes file you shared. Adjust if yours differ.
  login: async (email: string, password: string) => {
    const body = await request<Record<string, unknown>>("/login", send("POST", { email, password }));
    const token = extractToken(body);
    if (!token) throw new Error("Login succeeded but no token was returned");
    return token;
  },
  logout: () => request<void>("/logout", send("POST")),

  profile: {
    get: async () => unwrap<Profile>(await request<unknown>("/admin/profile")),
    update: async (fd: FormData) =>
      unwrap<Profile>(await request<unknown>("/admin/profile", { method: "POST", body: fd })),
  },

  experiences: resource<Experience>("experiences"),
  achievements: resource<Achievement>("achievements"),
  socialLinks: resource<SocialLink>("social-links"),

  projects: {
    ...resource<Project>("projects"),
    get: async (id: number) => unwrap<Project>(await request<unknown>(`/admin/projects/${id}`)),
    /** Multipart (cover + gallery uploads). Updates use method spoofing so PHP parses the files. */
    save: async (id: number | null, fd: FormData) => {
      if (id) fd.append("_method", "PUT");
      return unwrap<Project>(
        await request<unknown>(id ? `/admin/projects/${id}` : "/admin/projects", { method: "POST", body: fd }),
      );
    },
    deleteImage: (projectId: number, imageId: number) =>
      request<void>(`/admin/projects/${projectId}/images/${imageId}`, send("DELETE")),
    deleteLink: (projectId: number, linkId: number) =>
      request<void>(`/admin/projects/${projectId}/links/${linkId}`, send("DELETE")),
  },

  messages: {
    list: async () => unwrapList<ContactMessage>(await request<unknown>("/admin/contact-messages")),
    markRead: (id: number) => request<void>(`/admin/contact-messages/${id}/read`, send("PATCH")),
    remove: (id: number) => request<void>(`/admin/contact-messages/${id}`, send("DELETE")),
  },
};