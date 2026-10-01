export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectMedia {
  label: string;
  caption?: string;
  type: "image" | "video" | "document" | "screen";
  aspect: "video" | "square" | "wide" | "portrait";
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  company: string;
  period: string;
  role: string;
  summary: string;
  tags: string[];
  overview: string[];
  contributions: string[];
  metrics: ProjectMetric[];
  media: ProjectMedia[];
}

export const projects: Project[] = [
  {
    slug: "payment-orchestration",
    title: "Real-time payment orchestration platform",
    tagline: "A unified routing layer for $2B+ in annual payment volume.",
    company: "Vertex Payments",
    period: "2021 — Present",
    role: "Architecture lead",
    summary:
      "Designed and led the architecture of a real-time orchestration layer that routes, retries, and reconciles payments across multiple acquirers and PSPs.",
    tags: ["Event-driven", "Edge caching", "Distributed systems", "Observability"],
    overview: [
      "Payments flowed through a single legacy processor with no fallback path, creating single points of failure during traffic spikes and outages.",
      "I designed an orchestration layer that abstracts acquirers behind one contract, scores routes in real time on latency, cost, and success rate, and fails over mid-flight without dropping transactions.",
      "The system now processes $2B+ annually across three regions with a 99.99% success target, and new acquirers can be onboarded without code changes.",
    ],
    contributions: [
      "Authored the routing and retry model, including idempotency guarantees across asynchronous retries.",
      "Cut critical-path latency by 60% through an event-driven redesign and edge caching of authorization decisions.",
      "Built the reconciliation pipeline that detects and auto-resolves mismatched settlements daily.",
      "Grew the platform team from 4 to 14 engineers across 3 squads, with on-call and review processes.",
    ],
    metrics: [
      { label: "Annual volume", value: "$2B+" },
      { label: "Latency reduction", value: "60%" },
      { label: "Platform uptime", value: "99.99%" },
    ],
    media: [
      { label: "Orchestration flow diagram", caption: "Routing, retry, and reconciliation overview", type: "document", aspect: "video" },
      { label: "Live traffic dashboard", caption: "Route health and latency percentiles", type: "screen", aspect: "video" },
      { label: "Architecture deep-dive talk", caption: "Internal tech-talk recording", type: "video", aspect: "video" },
    ],
  },
  {
    slug: "seller-tools-rebuild",
    title: "Seller experience rebuild",
    tagline: "Rebuilt listing and inventory tools used by 40k+ merchants.",
    company: "Nova Marketplace",
    period: "2017 — 2021",
    role: "Senior engineer, seller experience team owner",
    summary:
      "Led the ground-up rebuild of the seller-facing listing, inventory, and order management tools powering 40k+ active merchants.",
    tags: ["Product engineering", "Design systems", "React", "Conversion"],
    overview: [
      "The legacy seller tools were slow, inconsistent, and built on patterns that broke under merchant scale — bulk edits could take minutes and silently fail.",
      "Over three years I owned the seller experience team and drove a staged rebuild: new listing flows, bulk inventory operations, and a shared component library that made every seller surface consistent.",
      "The rebuild shipped incrementally with zero downtime, and the new checkout flow it enabled lifted conversion by 12%.",
    ],
    contributions: [
      "Owned the seller experience team end-to-end, from roadmap to production support.",
      "Rebuilt bulk listing and inventory workflows, cutting the median bulk edit from minutes to seconds.",
      "Introduced design-system governance that cut UI regressions by half.",
      "Partnered with product and design on a new checkout flow that lifted conversion 12%.",
    ],
    metrics: [
      { label: "Merchants served", value: "40k+" },
      { label: "Conversion lift", value: "12%" },
      { label: "UI regressions", value: "-50%" },
    ],
    media: [
      { label: "Seller dashboard redesign", caption: "Before / after comparison", type: "screen", aspect: "video" },
      { label: "Design system showcase", caption: "Component library documentation", type: "image", aspect: "video" },
      { label: "Checkout funnel analysis", caption: "Conversion metrics deck", type: "document", aspect: "video" },
    ],
  },
  {
    slug: "micro-frontend-migration",
    title: "Monolith to micro-frontends migration",
    tagline: "Incrementally split a 1M-line monolith with zero downtime.",
    company: "Nova Marketplace",
    period: "2019 — 2021",
    role: "Migration lead",
    summary:
      "Led the incremental migration of a large frontend monolith into independently deployable micro-frontends, improving build times by 80%.",
    tags: ["Architecture", "CI/CD", "Team scaling", "Zero downtime"],
    overview: [
      "Every change to the storefront required a full monolith deploy — builds took 45 minutes, releases were weekly, and teams blocked each other on shared code.",
      "I designed a strangler-fig migration: route-by-route extraction behind an edge router, shared design tokens and contracts as versioned packages, and per-team deploy pipelines.",
      "Teams now ship independently multiple times a day, and the build for any given surface takes minutes instead of the full monolith.",
    ],
    contributions: [
      "Defined the extraction playbook: seam detection, contract-first APIs, and progressive rollout flags.",
      "Improved build times by 80% by scoping builds to owned surfaces.",
      "Established shared component and API contracts used by six product teams.",
      "Ran the migration with zero customer-facing downtime across 18 months.",
    ],
    metrics: [
      { label: "Build time", value: "-80%" },
      { label: "Deploy frequency", value: "Weekly → daily" },
      { label: "Downtime during migration", value: "0" },
    ],
    media: [
      { label: "Migration roadmap diagram", caption: "Strangler-fig phases and ownership", type: "document", aspect: "video" },
      { label: "Deploy pipeline overview", caption: "Per-team CI/CD flow", type: "screen", aspect: "video" },
    ],
  },
  {
    slug: "analytics-dashboards",
    title: "Enterprise analytics dashboards",
    tagline: "Visualizing billions of events in real time.",
    company: "Cinder Analytics",
    period: "2014 — 2017",
    role: "Software engineer",
    summary:
      "Built real-time dashboards used by enterprise customers to visualize billions of streamed events, with alerting that cut MTTR by 35%.",
    tags: ["Data visualization", "Real-time", "Performance", "Alerting"],
    overview: [
      "Enterprise customers needed to answer operational questions from billions of events without waiting on nightly batch reports.",
      "I built streaming dashboards over a column-store backend with server-side aggregation windows, so panels render in under a second even across full-history queries.",
      "Real-time alerting rules built on the same pipeline notified customers before incidents escalated.",
    ],
    contributions: [
      "Built the dashboard rendering layer with server-side aggregation and query caching.",
      "Implemented real-time alerting that reduced customer MTTR by 35%.",
      "Contributed to open-source visualization libraries adopted across the team.",
    ],
    metrics: [
      { label: "Events visualized", value: "Billions" },
      { label: "Panel render target", value: "<1s" },
      { label: "MTTR reduction", value: "35%" },
    ],
    media: [
      { label: "Dashboard overview", caption: "Enterprise customer view", type: "image", aspect: "video" },
      { label: "Query pipeline diagram", caption: "Aggregation and caching layers", type: "document", aspect: "video" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
