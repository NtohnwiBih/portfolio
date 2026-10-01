import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MediaGrid, MediaPlaceholder } from "@/components/media-placeholder";
import { useProject, useProjects, ApiError } from "@/hooks/use-api";
import { LoadingState } from "@/components/state-block";

const linkLabels: Record<string, string> = {
  live: "Live site",
  repo: "GitHub repo",
  docs: "Documentation",
  case_study: "Case study",
  video: "Video demo",
  other: "Link",
};

function ProjectNotFound() {
  return (
    <div className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
          Missing project
        </p>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          That project doesn't exist.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The project you're looking for isn't in the portfolio.
        </p>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all projects
        </Link>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { data, isLoading, isError, error } = useProject(slug);
  const { data: allProjects } = useProjects();
  const project = data?.data;

  useEffect(() => {
    if (project) document.title = `${project.title} — Ntohnwi Bih`;
  }, [project]);

  if (isLoading) return <LoadingState />;
  if (isError) {
    if (error instanceof ApiError && error.status === 404) return <ProjectNotFound />;
    return <ProjectNotFound />; // any other failure also lands on this — no partial/broken page
  }
  if (!project) return null;

  const list = allProjects?.data ?? [];
  const index = list.findIndex((p) => p.slug === project.slug);
  const next = list.length > 0 ? list[(index + 1) % list.length] : null;

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>

        <header className="mt-8 border-b border-border pb-10">
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent capitalize">
            {project.type} project
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.short_description}</p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {project.description && (
              <>
                <h2 className="font-heading text-xl font-semibold text-foreground">Overview</h2>
                <div className="mt-4 space-y-4">
                  {project.description.split("\n").filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Type
              </p>
              <p className="mt-2 font-heading text-lg font-semibold capitalize text-card-foreground">
                {project.type}
              </p>

              {project.tech_stack.length > 0 && (
                <>
                  <div className="my-4 h-px bg-border" />
                  <p className="font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Stack & focus
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech_stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-accent/30 px-3 py-1 text-xs font-medium text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {project.links && project.links.length > 0 && (
              <div className="flex flex-col gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    {linkLabels[link.type] ?? link.label}
                  </a>
                ))}
              </div>
            )}
          </aside>
        </div>

        {(project.cover_image_url || (project.images && project.images.length > 0)) && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Project visuals
            </h2>
            <MediaGrid columns={2} className="mt-8">
              {project.cover_image_url && (
                <img
                  src={project.cover_image_url}
                  alt={project.title}
                  className="aspect-video w-full rounded-xl border border-border object-cover"
                />
              )}
              {project.images?.map((img) => (
                <figure key={img.id} className="overflow-hidden rounded-xl border border-border">
                  <img src={img.url} alt={img.caption ?? project.title} className="aspect-video w-full object-cover" />
                  {img.caption && (
                    <figcaption className="bg-card px-4 py-3 text-sm text-muted-foreground">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </MediaGrid>
          </section>
        )}

        {next && (
          <nav className="mt-16 flex items-center justify-between border-t border-border pt-8">
            <Link to={`/projects/${next.slug}`} className="group ml-auto text-right">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Next project
              </p>
              <p className="mt-1 inline-flex items-center gap-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                {next.title}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}