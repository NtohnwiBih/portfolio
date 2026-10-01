import { Image, Play, FileText, Monitor } from "lucide-react";

export type MediaType = "image" | "video" | "document" | "screen";

interface MediaPlaceholderProps {
  label: string;
  caption?: string;
  type?: MediaType;
  aspect?: "video" | "square" | "wide" | "portrait";
  className?: string;
}

const typeIcons: Record<MediaType, typeof Image> = {
  image: Image,
  video: Play,
  document: FileText,
  screen: Monitor,
};

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
};

export function MediaPlaceholder({
  label,
  caption,
  type = "image",
  aspect = "video",
  className,
}: MediaPlaceholderProps) {
  const Icon = typeIcons[type];

  return (
    <figure className={className}>
      <div
        className={`group relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/30 ${aspectClasses[aspect]} transition-colors hover:border-accent/30 hover:bg-accent/5`}
      >
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-accent/30 group-hover:text-accent">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-medium text-muted-foreground">{label}</p>
            {caption && <p className="mt-1 text-xs text-muted-foreground/70">{caption}</p>}
          </div>
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
      {(label || caption) && (
        <figcaption className="sr-only">
          {label} {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface MediaGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MediaGrid({ children, columns = 3, className }: MediaGridProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${columnClasses[columns]} ${className || ""}`}>{children}</div>
  );
}
