import { useEffect } from "react";
import { MediaPlaceholder, MediaGrid } from "@/components/media-placeholder";
import { useExperiences } from "@/hooks/use-api";
import { LoadingState, ErrorState } from "@/components/state-block";

function formatRange(start: string, end: string | null, isCurrent: boolean) {
  const startYear = new Date(start).getFullYear();
  if (isCurrent) return `${startYear} — Present`;
  return `${startYear} — ${end ? new Date(end).getFullYear() : ""}`;
}

export default function Experience() {
  const { data, isLoading, isError, error } = useExperiences();

  useEffect(() => {
    document.title = "Experience — Ntohnwi Bih";
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message ?? "Unknown error"} />;

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16">
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
            Experience
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            A career built on impact.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            From early-stage startups to high-growth fintech, each role sharpened my ability to ship
            reliable systems and grow the people around me.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-accent/30 md:left-[11px]" />

          <div className="space-y-12">
            {data?.data.map((exp) => (
              <div key={exp.id} className="relative pl-10 md:pl-14">
                <div className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background md:top-2 md:h-4 md:w-4" />

                <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30 sm:p-8">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-heading text-xl font-semibold text-card-foreground sm:text-2xl">
                      {exp.role_title}
                    </h2>
                    <span className="text-sm font-medium text-accent">
                      {formatRange(exp.start_date, exp.end_date, exp.is_current)}
                    </span>
                  </div>
                  <p className="mt-1 text-base font-medium text-muted-foreground">{exp.company}</p>

                  <ul className="mt-5 space-y-3">
                    {exp.highlights.map((highlight, hIndex) => (
                      <li
                        key={hIndex}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data?.snapshots && data.snapshots.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Selected work snapshots
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Visual placeholders for key deliverables from each chapter of my career.
            </p>

            <MediaGrid columns={3} className="mt-8">
              {data.snapshots.map((snap, i) =>
                snap.image_url ? (
                  <figure key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                    <img src={snap.image_url} alt={snap.title} className="aspect-video w-full object-cover" />
                    <figcaption className="p-4 text-sm text-muted-foreground">
                      <span className="block font-medium text-card-foreground">{snap.title}</span>
                      {snap.subtitle}
                    </figcaption>
                  </figure>
                ) : (
                  <MediaPlaceholder
                    key={i}
                    label={snap.title}
                    caption={snap.subtitle ?? undefined}
                    type={(snap.icon as "document" | "screen" | "image" | "video") ?? "document"}
                    aspect="video"
                  />
                ),
              )}
            </MediaGrid>
          </div>
        )}
      </div>
    </div>
  );
}