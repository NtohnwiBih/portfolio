import { useEffect } from "react";
import { ArrowUpRight, Award, Zap, Globe, TrendingUp, type LucideIcon } from "lucide-react";
import { MediaGrid, MediaPlaceholder } from "@/components/media-placeholder";
import { useAchievements } from "@/hooks/use-api";
import { LoadingState, ErrorState } from "@/components/state-block";

const iconMap: Record<string, LucideIcon> = {
  bolt: Zap,
  globe: Globe,
  award: Award,
  trending: TrendingUp,
};

function resolveIcon(name: string | null): LucideIcon {
  return (name && iconMap[name]) || Award;
}

export default function Achievements() {
  const { data, isLoading, isError, error } = useAchievements();

  useEffect(() => {
    document.title = "Achievements — Ntohnwi Bih";
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message ?? "Unknown error"} />;

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
            Achievements
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Outcomes that speak louder than titles.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Selected projects, awards, and measurable impact from the last decade of building
            software.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((achievement) => {
            const Icon = resolveIcon(achievement.icon);
            return (
              <div
                key={achievement.id}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-accent/10"
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-heading text-2xl font-bold text-accent">
                    {achievement.metric_label}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-lg font-semibold text-card-foreground">
                  {achievement.title}
                </h3>
                {achievement.subtitle && (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {achievement.subtitle}
                  </p>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {achievement.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {achievement.tags.map((tag, tIndex) => (
                    <span
                      key={tIndex}
                      className="rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  View details
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>

        {data?.gallery && data.gallery.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Project gallery
            </h2>
            <MediaGrid columns={3} className="mt-8">
              {data.gallery.map((item, i) => (
                <MediaPlaceholder
                  key={i}
                  label={item.title}
                  caption={item.subtitle ?? undefined}
                  type={(item.icon as "document" | "screen" | "image" | "video") ?? "document"}
                  aspect="video"
                />
              ))}
            </MediaGrid>
          </div>
        )}
      </div>
    </div>
  );
}