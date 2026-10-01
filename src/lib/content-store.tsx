import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { projects as defaultProjects, type Project } from "@/lib/projects";
import { defaultPages, type PagesContent, type PageKey } from "@/lib/page-content";

export interface SiteSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export const defaultSettings: SiteSettings = {
  name: "Ntohnwi Bih",
  email: "mforbesintohnwi@gmail.com",
  phone: "+237 672 81 35 49",
  location: "Yaoundé, Cameroon",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
};

interface ContentState {
  projects: Project[];
  settings: SiteSettings;
  pages: PagesContent;
  savePage: <K extends PageKey>(key: K, data: PagesContent[K]) => void;
  saveProject: (project: Project, originalSlug?: string) => void;
  deleteProject: (slug: string) => void;
  moveProject: (slug: string, dir: -1 | 1) => void;
  saveSettings: (s: SiteSettings) => void;
  resetAll: () => void;
}

const STORAGE_KEY = "nb-portfolio-content-v1";
const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [pages, setPages] = useState<PagesContent>(defaultPages);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (data.pages) {
          const merged = { ...defaultPages } as PagesContent;
          (Object.keys(defaultPages) as PageKey[]).forEach((k) => {
            (merged as any)[k] = { ...defaultPages[k], ...(data.pages[k] ?? {}) };
          });
          setPages(merged);
        }
        if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, settings, pages }));
  }, [projects, settings, pages, loaded]);

  const value: ContentState = {
    projects,
    settings,
    pages,
    savePage: (key, data) => setPages((prev) => ({ ...prev, [key]: data })),
    saveProject: (project, originalSlug) =>
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.slug === (originalSlug ?? project.slug));
        if (idx === -1) return [...prev, project];
        const next = [...prev];
        next[idx] = project;
        return next;
      }),
    deleteProject: (slug) => setProjects((prev) => prev.filter((p) => p.slug !== slug)),
    moveProject: (slug, dir) =>
      setProjects((prev) => {
        const i = prev.findIndex((p) => p.slug === slug);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= prev.length) return prev;
        const next = [...prev];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    saveSettings: setSettings,
    resetAll: () => {
      setProjects(defaultProjects);
      setSettings(defaultSettings);
      setPages(defaultPages);
    },
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
