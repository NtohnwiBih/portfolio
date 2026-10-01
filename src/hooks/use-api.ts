import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/api/client";

export function useHome() {
  return useQuery({ queryKey: ["home"], queryFn: api.getHome });
}

export function useExperiences() {
  return useQuery({ queryKey: ["experiences"], queryFn: api.getExperiences });
}

export function useExpertise() {
  return useQuery({ queryKey: ["expertise"], queryFn: api.getExpertise });
}

export function useAchievements() {
  return useQuery({ queryKey: ["achievements"], queryFn: api.getAchievements });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => api.getProject(slug),
    enabled: Boolean(slug),
  });
}

export function useProjects(type?: "frontend" | "backend" | "fullstack") {
  return useQuery({
    queryKey: ["projects", type],
    queryFn: () => api.getProjects(type),
  });
}

export { ApiError };