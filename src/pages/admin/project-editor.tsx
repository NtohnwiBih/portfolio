import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/api/admin-api";
import { errorMessage } from "@/api/client";
import type { Project, ProjectLink, ProjectType } from "@/api/types";

const LINK_TYPES: ProjectLink["type"][] = ["live", "repo", "docs", "case_study", "video", "other"];
const PROJECT_TYPES: ProjectType[] = ["frontend", "backend", "fullstack"];

const selectClass = "h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground";

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

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => adminApi.projects.get(Number(id)),
    enabled: !isNew,
  });

  if (!isNew && isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!isNew && (error || !data)) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/admin/projects" className="mt-4 inline-block text-accent">Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
        {isNew ? "Projects" : "Edit project"}
      </p>
      <h1 className="mb-8 mt-2 font-heading text-3xl font-bold text-foreground">
        {isNew ? "New project" : data!.title}
      </h1>
      <Editor key={data?.id ?? "new"} project={data} />
    </div>
  );
}

function Editor({ project }: { project?: Project }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [f, setF] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    type: (project?.type ?? "fullstack") as ProjectType,
    short_description: project?.short_description ?? "",
    description: project?.description ?? "",
    tech_stack: (project?.tech_stack ?? []).join(", "),
    is_featured: project?.is_featured ?? false,
    status: (project?.status ?? "draft") as Project["status"],
  });
  const [cover, setCover] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [newLinks, setNewLinks] = useState<{ label: string; type: ProjectLink["type"]; url: string }[]>([]);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("title", f.title);
      if (f.slug.trim()) fd.append("slug", f.slug.trim());
      fd.append("type", f.type);
      fd.append("short_description", f.short_description);
      fd.append("description", f.description);
      f.tech_stack.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append("tech_stack[]", t));
      fd.append("is_featured", f.is_featured ? "1" : "0");
      fd.append("status", f.status);
      if (cover) fd.append("cover_image", cover);
      files.forEach((file) => fd.append("images[]", file));
      newLinks.filter((l) => l.label.trim() && l.url.trim()).forEach((l, i) => {
        fd.append(`links[${i}][label]`, l.label);
        fd.append(`links[${i}][type]`, l.type);
        fd.append(`links[${i}][url]`, l.url);
      });
      return adminApi.projects.save(project?.id ?? null, fd);
    },
    onSuccess: () => {
      toast.success(project ? "Project updated" : "Project created");
      qc.invalidateQueries();
      navigate("/admin/projects");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const removeExisting = useMutation({
    mutationFn: (p: { kind: "image" | "link"; id: number }) =>
      p.kind === "image"
        ? adminApi.projects.deleteImage(project!.id, p.id)
        : adminApi.projects.deleteLink(project!.id, p.id),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.title.trim()) return toast.error("Title is required");
    save.mutate();
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *">
            <Input value={f.title} maxLength={120} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="URL slug">
            <Input value={f.slug} placeholder="auto-from-title" onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Type">
            <select className={selectClass} value={f.type} onChange={(e) => set("type", e.target.value as ProjectType)}>
              {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={selectClass} value={f.status} onChange={(e) => set("status", e.target.value as Project["status"])}>
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </Field>
        </div>
        <Field label="Short description">
          <Textarea rows={2} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} />
        </Field>
        <Field label="Full description">
          <Textarea rows={8} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Tech stack (comma separated)">
          <Input value={f.tech_stack} onChange={(e) => set("tech_stack", e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={f.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
          Feature on the home page
        </label>
      </Section>

      <Section title="Images">
        <Field label="Cover image">
          {project?.cover_image_url && !cover && (
            <img src={project.cover_image_url} alt="Current cover" className="h-28 rounded-lg object-cover" />
          )}
          <Input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
        </Field>
        {!!project?.images?.length && (
          <div className="flex flex-wrap gap-3">
            {project.images.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt={img.caption ?? ""} className="h-20 w-28 rounded object-cover" />
                <Button type="button" size="icon" variant="secondary" aria-label="Remove image"
                  className="absolute -right-2 -top-2 h-6 w-6 text-destructive"
                  onClick={() => confirm("Remove this image?") && removeExisting.mutate({ kind: "image", id: img.id })}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Field label="Add gallery images">
          <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </Field>
      </Section>

      <Section title="Links">
        {project?.links?.map((l) => (
          <div key={l.id} className="flex items-center gap-2 text-sm">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{l.type}</span>
            <span className="font-medium text-foreground">{l.label}</span>
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{l.url}</span>
            <Button type="button" size="icon" variant="ghost" className="text-destructive" aria-label="Remove link"
              onClick={() => confirm("Remove this link?") && removeExisting.mutate({ kind: "link", id: l.id })}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {newLinks.map((l, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_auto_2fr_auto]">
            <Input placeholder="Label" value={l.label}
              onChange={(e) => setNewLinks(newLinks.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <select className={selectClass} value={l.type}
              onChange={(e) => setNewLinks(newLinks.map((x, j) => (j === i ? { ...x, type: e.target.value as ProjectLink["type"] } : x)))}>
              {LINK_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <Input type="url" placeholder="https://" value={l.url}
              onChange={(e) => setNewLinks(newLinks.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
            <Button type="button" size="icon" variant="ghost" aria-label="Remove"
              onClick={() => setNewLinks(newLinks.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm"
          onClick={() => setNewLinks([...newLinks, { label: "", type: "live", url: "" }])}>
          <Plus className="h-4 w-4" /> Add link
        </Button>
      </Section>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate("/admin/projects")}>Cancel</Button>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}