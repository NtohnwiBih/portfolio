export interface Profile {
  name: string;
  role_title: string;
  hero_title: string;
  hero_highlight: string | null;
  hero_description: string;
  photo_url: string | null;
  photo_caption: string | null;
  quote: string | null;
  quote_author: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  contact_intro: string | null;
  resume_url: string | null;
  footer_text: string | null;
}

export interface SocialLink {
  id: number;
  platform: string;
  icon: string | null;
  url: string;
}

export interface Experience {
  id: number;
  role_title: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  highlights: string[];
}

export interface MediaItem {
  title: string;
  subtitle: string | null;
  icon: string | null;
  media_url?: string | null;
  image_url?: string | null;
  link?: string | null;
}

export interface ExpertisePrinciple {
  icon: string | null;
  title: string;
  description: string;
}

export interface ExpertiseCategory {
  icon: string | null;
  title: string;
  items: string[];
}

export interface ExpertiseStat {
  value: string;
  label: string;
}

export interface Achievement {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  icon: string | null;
  metric_label: string;
  tags: string[];
}

export type ProjectType = "frontend" | "backend" | "fullstack";

export interface ProjectImage {
  id: number;
  url: string;
  caption: string | null;
}

export interface ProjectLink {
  id: number;
  label: string;
  type: "live" | "repo" | "docs" | "case_study" | "video" | "other";
  url: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  type: ProjectType;
  short_description: string;
  description?: string;
  tech_stack: string[];
  cover_image_url: string | null;
  is_featured: boolean;
  status: "draft" | "published";
  images?: ProjectImage[];
  links?: ProjectLink[];
}

export interface HomeData {
  profile: Profile | null;
  social_links: SocialLink[];
  featured_projects: Pick<Project, "title" | "slug" | "short_description" | "cover_image_url">[];
}

export interface ExperienceData {
  data: Experience[];
  snapshots: MediaItem[];
}

export interface ExpertiseData {
  principles: ExpertisePrinciple[];
  categories: ExpertiseCategory[];
  stats: ExpertiseStat[];
  highlights: MediaItem[];
}

export interface AchievementData {
  data: Achievement[];
  gallery: MediaItem[];
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}