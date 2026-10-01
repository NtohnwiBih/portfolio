import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContent, type SiteSettings } from "@/lib/content-store";

const fields: { key: keyof SiteSettings; label: string }[] = [
  { key: "name", label: "Display name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "github", label: "GitHub URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "twitter", label: "Twitter URL" },
];

export default function SettingsPage() {
  const { settings, saveSettings } = useContent();
  const [form, setForm] = useState(settings);
  useEffect(() => setForm(settings), [settings]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveSettings(form);
    toast.success("Settings saved");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Content</p>
      <h1 className="mb-8 mt-2 font-heading text-3xl font-bold text-foreground">Site settings</h1>
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input id={f.key} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Used on the Contact page and site footer.</p>
        <div className="flex justify-end">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  );
}