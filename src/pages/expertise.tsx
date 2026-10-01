import { useEffect } from "react";
import { Users, Layers, Gauge, Shield, Lightbulb, Rocket, type LucideIcon } from "lucide-react";
import { MediaPlaceholder, MediaGrid } from "@/components/media-placeholder";
import { useExpertise } from "@/hooks/use-api";
import { LoadingState, ErrorState } from "@/components/state-block";

// Your API returns icon *names* (strings) rather than components — map them here.
// Extend this map as you add more icon values via the admin.
const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  server: Gauge,
  shield: Shield,
  people: Users,
  lightbulb: Lightbulb,
  rocket: Rocket,
};

function resolveIcon(name: string | null): LucideIcon {
  return (name && iconMap[name]) || Layers;
}

export default function Expertise() {
  const { data, isLoading, isError, error } = useExpertise();

  useEffect(() => {
    document.title = "Leadership & Expertise — Ntohnwi Bih";
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={(error as Error)?.message ?? "Unknown error"} />;

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-3xl">
          <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
            Leadership & Expertise
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Technical depth with a human lens.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Staff engineering is where architecture, product sense, and people leadership intersect.
            I operate across all three.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {data?.principles.map((principle, index) => {
            const Icon = resolveIcon(principle.icon);
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-card-foreground">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Core capabilities
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data?.categories.map((category, index) => {
              const Icon = resolveIcon(category.icon);
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/30"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-card-foreground">
                    {category.title}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {category.items.map((item, sIndex) => (
                      <li key={sIndex} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {data?.stats && data.stats.length > 0 && (
          <div className="mt-20 rounded-2xl border border-border bg-secondary/30 p-8 sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-4xl font-bold text-accent sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.highlights && data.highlights.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Capability highlights
            </h2>
            <MediaGrid columns={3} className="mt-8">
              {data.highlights.map((h, i) => (
                <MediaPlaceholder
                  key={i}
                  label={h.title}
                  caption={h.subtitle ?? undefined}
                  type={(h.icon as "document" | "screen" | "image" | "video") ?? "document"}
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