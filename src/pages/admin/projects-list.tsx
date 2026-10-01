import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/api/admin-api";
import { errorMessage } from "@/api/client";

export default function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: adminApi.projects.list,
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.projects.remove(id),
    onSuccess: () => {
      toast.success("Project deleted");
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Content</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Featured projects appear on the home page.</p>
        </div>
        <Button asChild>
          <Link to="/admin/projects/new"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        {isLoading && <p className="p-8 text-center text-muted-foreground">Loading…</p>}
        {error && <p className="p-8 text-center text-destructive">{errorMessage(error)}</p>}
        {!isLoading && !error && projects.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">No projects yet.</p>
        )}
        {projects.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 border-b border-border bg-card p-4 last:border-b-0 sm:flex-row sm:items-center">
            {p.cover_image_url ? (
              <img src={p.cover_image_url} alt="" className="h-12 w-20 rounded object-cover" />
            ) : (
              <div className="h-12 w-20 rounded bg-secondary/40" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{p.title}</p>
              <p className="truncate text-xs text-muted-foreground">{p.type} · /{p.slug}</p>
            </div>
            {p.is_featured && <Star className="h-4 w-4 text-primary" aria-label="Featured" />}
            <span className={`w-fit rounded-full border px-2 py-0.5 text-xs ${
              p.status === "published" ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
              {p.status}
            </span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" asChild aria-label="View">
                <Link to={`/projects/${p.slug}`}><Eye className="h-4 w-4" /></Link>
              </Button>
              <Button size="icon" variant="ghost" asChild aria-label="Edit">
                <Link to={`/admin/projects/${p.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete"
                onClick={() => { if (confirm(`Delete "${p.title}"?`)) remove.mutate(p.id); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}