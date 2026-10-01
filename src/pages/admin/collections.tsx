import CrudPage from "@/components/admin/CrudPage";
import { adminApi } from "@/api/admin-api";
import type { Achievement, Experience, SocialLink } from "@/api/types";

export function AdminExperiences() {
  return (
    <CrudPage<Experience>
      title="Experience"
      singular="Role"
      description="Work history shown on the Experience page."
      name="experiences"
      api={adminApi.experiences}
      itemTitle={(e) => `${e.role_title} · ${e.company}`}
      itemSubtitle={(e) => `${e.start_date} — ${e.is_current ? "Present" : e.end_date ?? ""}`}
      fields={[
        { key: "role_title", label: "Role title", kind: "text", required: true },
        { key: "company", label: "Company", kind: "text", required: true },
        { key: "start_date", label: "Start date", kind: "date", required: true },
        { key: "end_date", label: "End date", kind: "date" },
        { key: "is_current", label: "I currently work here", kind: "checkbox" },
        { key: "highlights", label: "Highlights", kind: "lines" },
      ]}
    />
  );
}

export function AdminAchievements() {
  return (
    <CrudPage<Achievement>
      title="Achievements"
      singular="Achievement"
      description="Wins and milestones shown on the Achievements page."
      name="achievements"
      api={adminApi.achievements}
      itemTitle={(a) => a.title}
      itemSubtitle={(a) => a.metric_label}
      fields={[
        { key: "title", label: "Title", kind: "text", required: true },
        { key: "subtitle", label: "Subtitle", kind: "text" },
        { key: "description", label: "Description", kind: "textarea", required: true },
        { key: "metric_label", label: "Metric label", kind: "text", required: true },
        { key: "icon", label: "Icon name", kind: "text" },
        { key: "tags", label: "Tags", kind: "tags" },
      ]}
    />
  );
}

export function AdminSocialLinks() {
  return (
    <CrudPage<SocialLink>
      title="Social links"
      singular="Link"
      description="Shown in the footer and on the Contact page."
      name="social-links"
      api={adminApi.socialLinks}
      itemTitle={(s) => s.platform}
      itemSubtitle={(s) => s.url}
      fields={[
        { key: "platform", label: "Platform", kind: "text", required: true, placeholder: "GitHub" },
        { key: "url", label: "URL", kind: "url", required: true },
        { key: "icon", label: "Icon name", kind: "text" },
      ]}
    />
  );
}