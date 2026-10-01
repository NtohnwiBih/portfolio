import { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Briefcase, Code2, Trophy, Mail } from "lucide-react";
import { MediaPlaceholder, MediaGrid } from "@/components/media-placeholder";
import portraitImage from "@/assets/developer-portrait.jpeg";
import { useHome } from "@/hooks/use-api";
import type { LayoutContext } from "@/components/Layout";
import { LoadingState, ErrorState } from "@/components/state-block";

const sections = [
  {
    to: "/experience",
    label: "Experience",
    description: "A decade of building products across fintech, marketplaces, and infrastructure.",
    icon: Briefcase,
  },
  {
    to: "/expertise",
    label: "Leadership & Expertise",
    description: "Staff+ engineering, system design, and growing high-performing teams.",
    icon: Code2,
  },
  {
    to: "/achievements",
    label: "Achievements",
    description: "Shipped features that moved revenue, latency, and user happiness metrics.",
    icon: Trophy,
  },
  {
    to: "/contact",
    label: "Contact",
    description: "Open to staff engineering roles, advisory work, and interesting problems.",
    icon: Mail,
  },
];

export default function Home() {
  // Layout already fetches /home once; reuse it instead of a second request.
  const { home } = useOutletContext<LayoutContext>();
  const { isLoading, isError, error } = useHome();
  const profile = home?.profile;

  useEffect(() => {
    document.title = "Ntohnwi Bih — Staff Software Engineer";
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message ?? "Unknown error"} />;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.75fr)] lg:gap-16">
            <div className="max-w-3xl">
              <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
                {profile?.role_title ?? "Staff Software Engineer"}
              </p>
              <h1 className="mt-6 font-heading text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                {profile?.hero_title ?? "Building systems that scale and teams tha."}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {profile?.hero_description ??
                  "I design resilient architectures, lead cross-functional engineering teams, and turn ambiguous product goals into reliable software."}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  Get in touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/experience"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                >
                  View experience
                </Link>
              </div>
            </div>

            <figure className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-lg border border-accent/50" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card">
                <img
                  src={profile?.photo_url ?? portraitImage}
                  alt={profile?.name ?? "Developer portrait"}
                  className="h-full w-full object-cover object-[center_30%]"
                  fetchPriority="high"
                />
              </div>
              <figcaption className="relative mt-5 flex items-center gap-3 font-heading text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <span className="h-px w-8 bg-accent" />
                {profile?.photo_caption ?? "Engineering with purpose"}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Explore the work
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                A portfolio focused on impact, craft, and the people who make it possible.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.to}
                  to={section.to}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-accent/5"
                >
                  <div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">
                      {section.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured work — now from /api/projects (is_featured) instead of static placeholders */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="font-heading text-sm font-medium uppercase tracking-widest text-primary">
              Featured work
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Projects worth seeing.
            </h2>
          </div>

          {home?.featured_projects && home.featured_projects.length > 0 ? (
            <MediaGrid columns={3}>
              {home.featured_projects.map((project) =>
                project.cover_image_url ? (
                  <Link
                    to={`/projects/${project.slug}`}
                    key={project.slug}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/30"
                  >
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="aspect-video w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="font-heading text-sm font-semibold text-card-foreground">
                        {project.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{project.short_description}</p>
                    </div>
                  </Link>
                ) : (
                  <MediaPlaceholder
                    key={project.slug}
                    label={project.title}
                    caption={project.short_description}
                    type="screen"
                    aspect="video"
                  />
                ),
              )}
            </MediaGrid>
          ) : (
            <p className="text-sm text-muted-foreground">
              No featured projects yet — mark a project as featured in the admin to show it here.
            </p>
          )}
        </div>
      </section>

      {/* Quote */}
      {profile?.quote && (
        <section className="border-t border-border bg-secondary/30 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <blockquote className="font-heading text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              "{profile.quote}"
            </blockquote>
            {profile.quote_author && (
              <p className="mt-6 text-sm font-medium uppercase tracking-widest text-accent">
                {profile.quote_author}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}