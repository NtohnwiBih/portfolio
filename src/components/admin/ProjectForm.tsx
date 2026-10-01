import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project, ProjectMedia } from "@/lib/projects";
import { slugify, useContent } from "@/lib/content-store";

const empty: Project = {
  slug: "",
  title: "",
  tagline: "",
  company: "",
  period: "",
  role: "",
  summary: "",
  tags: [],
  overview: [""],
  contributions: [""],
  metrics: [{ label: "", value: "" }],
  media: [{ label: "Project visual", caption: "", type: "image", aspect: "video" }],
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              rows={2}
              value={item}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Button type="button" size="icon" variant="ghost" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </Field>
  );
}

export function ProjectForm({ initial }: { initial?: Project }) {
  const { projects, saveProject } = useContent();
  const navigate = useNavigate();
  const [p, setP] = useState<Project>(initial ?? empty);
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const slug = slugify(p.slug || p.title);
    if (!p.title.trim() || !slug) return toast.error("Title is required");
    if (projects.some((x) => x.slug === slug && x.slug !== initial?.slug))
      return toast.error("Another project already uses that URL slug");
    const clean: Project = {
      ...p,
      slug,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      overview: p.overview.filter((x) => x.trim()),
      contributions: p.contributions.filter((x) => x.trim()),
      metrics: p.metrics.filter((m) => m.label.trim() || m.value.trim()),
      media: p.media.filter((m) => m.label.trim()),
    };
    if (clean.metrics.length === 0) clean.metrics = [{ label: "Status", value: "Shipped" }];
    if (clean.media.length === 0) clean.media = [{ label: "Project visual", type: "image", aspect: "video" }];
    saveProject(clean, initial?.slug);
    toast.success(initial ? "Project updated" : "Project created");
    navigate("/admin/projects");
  };

  const setMedia = (i: number, patch: Partial<ProjectMedia>) =>
    set("media", p.media.map((m, j) => (j === i ? { ...m, ...patch } : m)));

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *">
            <Input value={p.title} onChange={(e) => set("title", e.target.value)} maxLength={120} />
          </Field>
          <Field label="URL slug">
            <Input value={p.slug} placeholder={slugify(p.title) || "auto-from-title"} onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Company">
            <Input value={p.company} onChange={(e) => set("company", e.target.value)} />
          </Field>
          <Field label="Period">
            <Input value={p.period} placeholder="2021 — Present" onChange={(e) => set("period", e.target.value)} />
          </Field>
          <Field label="Role">
            <Input value={p.role} onChange={(e) => set("role", e.target.value)} />
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </Field>
        </div>
        <Field label="Tagline">
          <Input value={p.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Summary">
          <Textarea rows={3} value={p.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
      </Section>

      <Section title="Story">
        <ListEditor label="Overview paragraphs" items={p.overview} onChange={(v) => set("overview", v)} />
        <ListEditor label="Key contributions" items={p.contributions} onChange={(v) => set("contributions", v)} />
      </Section>

      <Section title="Metrics">
        {p.metrics.map((m, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Value (e.g. 60%)" value={m.value} onChange={(e) => set("metrics", p.metrics.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
            <Input placeholder="Label" value={m.label} onChange={(e) => set("metrics", p.metrics.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <Button type="button" size="icon" variant="ghost" aria-label="Remove" onClick={() => set("metrics", p.metrics.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => set("metrics", [...p.metrics, { label: "", value: "" }])}>
          <Plus className="h-4 w-4" /> Add metric
        </Button>
      </Section>

      <Section title="Media placeholders">
        {p.media.map((m, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
            <Input placeholder="Label" value={m.label} onChange={(e) => setMedia(i, { label: e.target.value })} />
            <Input placeholder="Caption" value={m.caption ?? ""} onChange={(e) => setMedia(i, { caption: e.target.value })} />
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" value={m.type} onChange={(e) => setMedia(i, { type: e.target.value as ProjectMedia["type"] })}>
              {["image", "video", "document", "screen"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" value={m.aspect} onChange={(e) => setMedia(i, { aspect: e.target.value as ProjectMedia["aspect"] })}>
              {["video", "square", "wide", "portrait"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <Button type="button" size="icon" variant="ghost" aria-label="Remove" onClick={() => set("media", p.media.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => set("media", [...p.media, { label: "", caption: "", type: "image", aspect: "video" }])}>
          <Plus className="h-4 w-4" /> Add media
        </Button>
      </Section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>Cancel</Button>
        <Button type="submit">{initial ? "Save changes" : "Create project"}</Button>
      </div>
    </form>
  );
}