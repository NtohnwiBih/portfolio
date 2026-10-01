import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { useProjects } from "@/hooks/use-api";
import { LoadingState, ErrorState } from "@/components/state-block";

export default function Projects() {
  const { data, isLoading, isError, error } = useProjects();

  useEffect(() => {
    document.title = "Projects — Ntohnwi Bih";
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message ?? "Unknown error"} />;

  const projects = data?.data ?? [];

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
            Projects
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Work with measurable outcomes.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Deep dives into the systems I have designed and shipped — the problem, the approach, and
            the numbers that show what changed.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published projects yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-accent/40"
              >
                <div className="pointer-events-none">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <MediaPlaceholder
                      label={project.title}
                      caption={project.short_description}
                      type="screen"
                      aspect="wide"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm font-medium capitalize text-muted-foreground">
                    {project.type} project
                  </p>
                  <h2 className="mt-3 font-heading text-xl font-semibold text-card-foreground group-hover:text-accent sm:text-2xl">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.short_description}
                  </p>
                  {project.tech_stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech_stack.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    View project details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}