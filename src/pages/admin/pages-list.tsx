import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { pageDefs } from "@/lib/page-content";

export default function PagesList() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Content</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Edit the text shown on each page of the site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pageDefs.map((p) => (
          <Link
            key={p.key}
            to={`/admin/pages/${p.key}`}
            className="group rounded-xl border border-border bg-card p-6 hover:border-accent/40"
          >
            <FileText className="h-6 w-6 text-accent" />
            <h2 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-accent">{p.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.path}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}