import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/api/client";
import type { Resource } from "@/api/admin-api";

export interface CrudField {
  key: string;
  label: string;
  kind: "text" | "textarea" | "lines" | "tags" | "checkbox" | "date" | "url";
  required?: boolean;
  placeholder?: string;
}

type Values = Record<string, unknown>;

function toForm(fields: CrudField[], item?: Values): Values {
  const v: Values = {};
  for (const f of fields) {
    const raw = item?.[f.key];
    if (f.kind === "checkbox") v[f.key] = Boolean(raw);
    else if (f.kind === "lines") v[f.key] = Array.isArray(raw) ? raw.join("\n") : "";
    else if (f.kind === "tags") v[f.key] = Array.isArray(raw) ? raw.join(", ") : "";
    else if (f.kind === "date") v[f.key] = typeof raw === "string" ? raw.slice(0, 10) : "";
    else v[f.key] = (raw as string | null | undefined) ?? "";
  }
  return v;
}

function toPayload(fields: CrudField[], v: Values): Values {
  const out: Values = {};
  for (const f of fields) {
    const raw = v[f.key];
    if (f.kind === "checkbox") out[f.key] = Boolean(raw);
    else if (f.kind === "lines")
      out[f.key] = String(raw).split("\n").map((s) => s.trim()).filter(Boolean);
    else if (f.kind === "tags")
      out[f.key] = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
    else out[f.key] = raw === "" && !f.required ? null : raw;
  }
  return out;
}

interface Props<T extends { id: number }> {
  eyebrow?: string;
  title: string;
  description: string;
  singular: string;
  name: string; // react-query key
  api: Resource<T>;
  fields: CrudField[];
  itemTitle: (item: T) => string;
  itemSubtitle?: (item: T) => string;
}

export default function CrudPage<T extends { id: number }>({
  eyebrow = "Content", title, description, singular, name, api, fields, itemTitle, itemSubtitle,
}: Props<T>) {
  const qc = useQueryClient();
  const { data: items = [], isLoading, error } = useQuery({ queryKey: ["admin", name], queryFn: api.list });
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [form, setForm] = useState<Values>({});

  const open = (item: T | "new") => {
    setEditing(item);
    setForm(toForm(fields, item === "new" ? undefined : (item as unknown as Values)));
  };

  // Invalidate everything: admin lists and the public site data depend on the same rows.
  const refresh = () => qc.invalidateQueries();

  const save = useMutation({
    mutationFn: () => {
      const payload = toPayload(fields, form);
      return editing === "new" || editing === null ? api.create(payload) : api.update(editing.id, payload);
    },
    onSuccess: () => {
      toast.success(`${singular} saved`);
      setEditing(null);
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.remove(id),
    onSuccess: () => {
      toast.success(`${singular} deleted`);
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => open("new")}><Plus className="h-4 w-4" /> New {singular.toLowerCase()}</Button>
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {editing === "new" ? `New ${singular.toLowerCase()}` : `Edit ${singular.toLowerCase()}`}
          </h2>
          {fields.map((f) => {
            const id = `${name}-${f.key}`;
            const val = form[f.key];
            const set = (v: unknown) => setForm((p) => ({ ...p, [f.key]: v }));
            if (f.kind === "checkbox")
              return (
                <label key={f.key} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={Boolean(val)} onChange={(e) => set(e.target.checked)} />
                  {f.label}
                </label>
              );
            return (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={id}>{f.label}{f.required ? " *" : ""}</Label>
                {f.kind === "textarea" || f.kind === "lines" ? (
                  <Textarea id={id} rows={f.kind === "lines" ? 4 : 3} required={f.required}
                    placeholder={f.kind === "lines" ? "One per line" : f.placeholder}
                    value={String(val ?? "")} onChange={(e) => set(e.target.value)} />
                ) : (
                  <Input id={id} required={f.required}
                    type={f.kind === "date" ? "date" : f.kind === "url" ? "url" : "text"}
                    placeholder={f.kind === "tags" ? "Comma separated" : f.placeholder}
                    value={String(val ?? "")} onChange={(e) => set(e.target.value)} />
                )}
              </div>
            );
          })}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save changes"}</Button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        {isLoading && <p className="p-8 text-center text-muted-foreground">Loading…</p>}
        {error && <p className="p-8 text-center text-destructive">{errorMessage(error)}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Nothing here yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border-b border-border bg-card p-4 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{itemTitle(item)}</p>
              {itemSubtitle && <p className="truncate text-xs text-muted-foreground">{itemSubtitle(item)}</p>}
            </div>
            <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => open(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete"
              onClick={() => { if (confirm(`Delete "${itemTitle(item)}"?`)) remove.mutate(item.id); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}