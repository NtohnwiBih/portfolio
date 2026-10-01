import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/api/admin-api";
import { errorMessage } from "@/api/client";
import type { Profile } from "@/api/types";

type TextKey = Exclude<keyof Profile, "photo_url">;
const fields: { key: TextKey; label: string; long?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "role_title", label: "Role title" },
  { key: "hero_title", label: "Hero title" },
  { key: "hero_highlight", label: "Hero highlight" },
  { key: "hero_description", label: "Hero description", long: true },
  { key: "photo_caption", label: "Photo caption" },
  { key: "quote", label: "Quote", long: true },
  { key: "quote_author", label: "Quote author" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "contact_intro", label: "Contact intro", long: true },
  { key: "resume_url", label: "Résumé URL" },
  { key: "footer_text", label: "Footer text" },
];

export default function AdminProfile() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "profile"], queryFn: adminApi.profile.get });
  const [form, setForm] = useState<Partial<Record<TextKey, string>>>({});
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (!data) return;
    const next: Partial<Record<TextKey, string>> = {};
    for (const f of fields) next[f.key] = (data[f.key] as string | null) ?? "";
    setForm(next);
  }, [data]);

  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      for (const f of fields) fd.append(f.key, form[f.key] ?? "");
      if (photo) fd.append("photo", photo);
      return adminApi.profile.update(fd);
    },
    onSuccess: () => {
      toast.success("Profile saved");
      setPhoto(null);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate();
  };

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">{errorMessage(error)}</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Content</p>
      <h1 className="mb-8 mt-2 font-heading text-3xl font-bold text-foreground">Profile</h1>
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-border bg-card p-6">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={`profile-${f.key}`}>{f.label}</Label>
            {f.long ? (
              <Textarea id={`profile-${f.key}`} rows={3} value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            ) : (
              <Input id={`profile-${f.key}`} value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            )}
          </div>
        ))}

        <div className="space-y-1.5">
          <Label htmlFor="profile-photo">Photo</Label>
          {data?.photo_url && !photo && (
            <img src={data.photo_url} alt="Current profile" className="h-24 w-24 rounded-lg object-cover" />
          )}
          <Input id="profile-photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</Button>
        </div>
      </form>
    </div>
  );
}