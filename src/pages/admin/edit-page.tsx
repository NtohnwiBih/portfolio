import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/lib/content-store";
import { pageDefs, type FieldDef, type PageKey } from "@/lib/page-content";

type Obj = Record<string, unknown>;

export default function EditPage() {
  const { page } = useParams<{ page: string }>();
  const def = pageDefs.find((d) => d.key === page);
  const { pages } = useContent();
  if (!def) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-muted-foreground">Page not found.</p>
        <Link to="/admin/pages" className="mt-4 inline-block text-accent">Back to pages</Link>
      </div>
    );
  }
  return <Editor key={def.key} pageKey={def.key} initial={pages[def.key] as unknown as Obj} />;
}

function Editor({ pageKey, initial }: { pageKey: PageKey; initial: Obj }) {
  const def = pageDefs.find((d) => d.key === pageKey)!;
  const { savePage } = useContent();
  const [form, setForm] = useState<Obj>(initial);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Edit page</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{def.title}</h1>
        </div>
        <a href={def.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-accent">
          View page <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePage(pageKey, form as never);
          toast.success(`${def.title} saved`);
        }}
        className="mt-8 space-y-6"
      >
        <div className="space-y-5 rounded-xl border border-border bg-card p-6">
          <Fields fields={def.fields} value={form} onChange={setForm} idPrefix={pageKey} />
        </div>
        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="lg">Save changes</Button>
        </div>
      </form>
    </div>
  );
}

function Fields({
  fields,
  value,
  onChange,
  idPrefix,
}: {
  fields: FieldDef[];
  value: Obj;
  onChange: (v: Obj) => void;
  idPrefix: string;
}) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <>
      {fields.map((f) => {
        const id = `${idPrefix}-${f.key}`;
        if (f.kind === "text")
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={id}>{f.label}</Label>
              <Input id={id} value={(value[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          );
        if (f.kind === "textarea")
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={id}>{f.label}</Label>
              <Textarea id={id} rows={3} value={(value[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          );
        if (f.kind === "lines")
          return (
            <div key={f.key} className="space-y-1.5">
              <Label htmlFor={id}>{f.label}</Label>
              <Textarea
                id={id}
                rows={4}
                value={((value[f.key] as string[]) ?? []).join("\n")}
                onChange={(e) => set(f.key, e.target.value.split("\n"))}
              />
            </div>
          );
        if (f.kind !== "list") return null;
        const items = (value[f.key] as Obj[]) ?? [];
        const setItems = (next: Obj[]) => set(f.key, next);
        return (
          <div key={f.key} className="space-y-3 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground">{f.label}</h2>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setItems([
                    ...items,
                    Object.fromEntries(f.fields.map((sf) => [sf.key, sf.kind === "lines" || sf.kind === "list" ? [] : ""])),
                  ])
                }
              >
                <Plus className="h-4 w-4" /> Add {f.itemLabel.toLowerCase()}
              </Button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="space-y-4 rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm font-semibold text-accent">
                    {f.itemLabel} {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <Button type="button" size="icon" variant="ghost" disabled={i === 0} aria-label="Move up"
                      onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setItems(n); }}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" disabled={i === items.length - 1} aria-label="Move down"
                      onClick={() => { const n = [...items]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; setItems(n); }}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="ghost" className="text-destructive" aria-label="Remove"
                      onClick={() => setItems(items.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Fields
                  fields={f.fields}
                  value={item}
                  idPrefix={`${id}-${i}`}
                  onChange={(v) => setItems(items.map((it, j) => (j === i ? v : it)))}
                />
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}