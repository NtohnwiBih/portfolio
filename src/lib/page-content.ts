// Editable copy for each public page, plus a schema the admin editor uses to render forms.

export type FieldDef =
  | { key: string; label: string; kind: "text" | "textarea" | "lines" }
  | { key: string; label: string; kind: "list"; itemLabel: string; fields: FieldDef[] };

export type PageData = Record<string, unknown>;

export interface PageDef {
  key: PageKey;
  title: string;
  path: string;
  fields: FieldDef[];
}

export type PageKey = "home" | "experience" | "expertise" | "achievements" | "contact";

const header: FieldDef[] = [
  { key: "eyebrow", label: "Small label above heading", kind: "text" },
  { key: "heading", label: "Heading", kind: "text" },
  { key: "intro", label: "Intro paragraph", kind: "textarea" },
];

export const pageDefs: PageDef[] = [
  {
    key: "home",
    title: "Home",
    path: "/",
    fields: [
      { key: "eyebrow", label: "Small label above heading", kind: "text" },
      { key: "headingBefore", label: "Heading (before highlight)", kind: "text" },
      { key: "headingHighlight", label: "Heading highlighted word", kind: "text" },
      { key: "headingAfter", label: "Heading (after highlight)", kind: "text" },
      { key: "intro", label: "Intro paragraph", kind: "textarea" },
      { key: "primaryCta", label: "Main button text", kind: "text" },
      { key: "secondaryCta", label: "Second button text", kind: "text" },
      { key: "portraitCaption", label: "Photo caption", kind: "text" },
      { key: "exploreHeading", label: "Explore section heading", kind: "text" },
      { key: "exploreIntro", label: "Explore section intro", kind: "textarea" },
      {
        key: "sections",
        label: "Explore cards (Experience, Expertise, Achievements, Contact)",
        kind: "list",
        itemLabel: "Card",
        fields: [
          { key: "label", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
      { key: "featuredEyebrow", label: "Featured work label", kind: "text" },
      { key: "featuredHeading", label: "Featured work heading", kind: "text" },
      { key: "featuredIntro", label: "Featured work intro", kind: "textarea" },
      { key: "quote", label: "Quote", kind: "textarea" },
    ],
  },
  {
    key: "experience",
    title: "Experience",
    path: "/experience",
    fields: [
      ...header,
      {
        key: "roles",
        label: "Roles",
        kind: "list",
        itemLabel: "Role",
        fields: [
          { key: "role", label: "Job title", kind: "text" },
          { key: "company", label: "Company", kind: "text" },
          { key: "period", label: "Period", kind: "text" },
          { key: "highlights", label: "Highlights (one per line)", kind: "lines" },
        ],
      },
      { key: "snapshotsHeading", label: "Snapshots heading", kind: "text" },
      { key: "snapshotsIntro", label: "Snapshots intro", kind: "textarea" },
    ],
  },
  {
    key: "expertise",
    title: "Leadership & Expertise",
    path: "/expertise",
    fields: [
      ...header,
      {
        key: "principles",
        label: "Leadership principles",
        kind: "list",
        itemLabel: "Principle",
        fields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "textarea" },
        ],
      },
      { key: "skillsHeading", label: "Skills heading", kind: "text" },
      {
        key: "skills",
        label: "Skill groups",
        kind: "list",
        itemLabel: "Group",
        fields: [
          { key: "title", label: "Group name", kind: "text" },
          { key: "skills", label: "Skills (one per line)", kind: "lines" },
        ],
      },
      {
        key: "metrics",
        label: "Numbers",
        kind: "list",
        itemLabel: "Number",
        fields: [
          { key: "value", label: "Value", kind: "text" },
          { key: "label", label: "Label", kind: "text" },
        ],
      },
      { key: "highlightsHeading", label: "Highlights heading", kind: "text" },
      { key: "highlightsIntro", label: "Highlights intro", kind: "textarea" },
    ],
  },
  {
    key: "achievements",
    title: "Achievements",
    path: "/achievements",
    fields: [
      ...header,
      {
        key: "items",
        label: "Achievements",
        kind: "list",
        itemLabel: "Achievement",
        fields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "organization", label: "Organization", kind: "text" },
          { key: "metric", label: "Headline number", kind: "text" },
          { key: "description", label: "Description", kind: "textarea" },
          { key: "tags", label: "Tags (one per line)", kind: "lines" },
        ],
      },
      { key: "galleryHeading", label: "Gallery heading", kind: "text" },
      { key: "galleryIntro", label: "Gallery intro", kind: "textarea" },
    ],
  },
  {
    key: "contact",
    title: "Contact",
    path: "/contact",
    fields: [
      ...header,
      { key: "portraitCaption", label: "Photo caption", kind: "text" },
      { key: "successTitle", label: "Message-sent title", kind: "text" },
      { key: "successText", label: "Message-sent text", kind: "textarea" },
    ],
  },
];

export interface PagesContent {
  home: {
    eyebrow: string; headingBefore: string; headingHighlight: string; headingAfter: string;
    intro: string; primaryCta: string; secondaryCta: string; portraitCaption: string;
    exploreHeading: string; exploreIntro: string;
    sections: { label: string; description: string }[];
    featuredEyebrow: string; featuredHeading: string; featuredIntro: string; quote: string;
  };
  experience: {
    eyebrow: string; heading: string; intro: string;
    roles: { role: string; company: string; period: string; highlights: string[] }[];
    snapshotsHeading: string; snapshotsIntro: string;
  };
  expertise: {
    eyebrow: string; heading: string; intro: string;
    principles: { title: string; description: string }[];
    skillsHeading: string;
    skills: { title: string; skills: string[] }[];
    metrics: { value: string; label: string }[];
    highlightsHeading: string; highlightsIntro: string;
  };
  achievements: {
    eyebrow: string; heading: string; intro: string;
    items: { title: string; organization: string; metric: string; description: string; tags: string[] }[];
    galleryHeading: string; galleryIntro: string;
  };
  contact: {
    eyebrow: string; heading: string; intro: string; portraitCaption: string;
    successTitle: string; successText: string;
  };
}

export const defaultPages: PagesContent = {
  home: {
    eyebrow: "Staff Software Engineer",
    headingBefore: "Building systems that",
    headingHighlight: "scale",
    headingAfter: "and teams that ship.",
    intro:
      "I design resilient architectures, lead cross-functional engineering teams, and turn ambiguous product goals into reliable software.",
    primaryCta: "Get in touch",
    secondaryCta: "View experience",
    portraitCaption: "Engineering with purpose",
    exploreHeading: "Explore the work",
    exploreIntro: "A portfolio focused on impact, craft, and the people who make it possible.",
    sections: [
      { label: "Experience", description: "A decade of building products across fintech, marketplaces, and infrastructure." },
      { label: "Leadership & Expertise", description: "Staff+ engineering, system design, and growing high-performing teams." },
      { label: "Achievements", description: "Shipped features that moved revenue, latency, and user happiness metrics." },
      { label: "Contact", description: "Open to staff engineering roles, advisory work, and interesting problems." },
    ],
    featuredEyebrow: "Featured work",
    featuredHeading: "Projects worth seeing.",
    featuredIntro:
      "Deep dives into recent systems — the problem, the approach, and the outcome. Click any card for full project details.",
    quote:
      "Great engineering isn't just clean code — it's clarity of thought, empathy for users, and the courage to simplify what's complex.",
  },
  experience: {
    eyebrow: "Experience",
    heading: "A career built on impact.",
    intro:
      "From early-stage startups to high-growth fintech, each role sharpened my ability to ship reliable systems and grow the people around me.",
    roles: [
      {
        role: "Staff Software Engineer", company: "Vertex Payments", period: "2021 — Present",
        highlights: [
          "Led architecture for a real-time payment orchestration platform processing $2B+ annually.",
          "Grew the platform team from 4 to 14 engineers across 3 squads.",
          "Reduced critical-path latency by 60% through event-driven redesign and edge caching.",
          "Mentored 5 senior engineers to staff level; two now lead their own teams.",
        ],
      },
      {
        role: "Senior Software Engineer", company: "Nova Marketplace", period: "2017 — 2021",
        highlights: [
          "Owned the seller experience team, rebuilding listing and inventory tools used by 40k+ merchants.",
          "Drove migration from monolith to micro-frontends, improving build times by 80%.",
          "Introduced design-system governance that cut UI regressions by half.",
          "Partnered with product and design to launch a new checkout flow that lifted conversion 12%.",
        ],
      },
      {
        role: "Software Engineer", company: "Cinder Analytics", period: "2014 — 2017",
        highlights: [
          "Built data-pipeline dashboards used by enterprise customers to visualize billions of events.",
          "Implemented real-time alerting that reduced customer MTTR by 35%.",
          "Contributed to open-source visualization libraries adopted by the team.",
        ],
      },
      {
        role: "Junior Developer", company: "Binary Foundry", period: "2012 — 2014",
        highlights: [
          "Developed customer-facing features for a SaaS CRM used by small businesses.",
          "Learned full-stack fundamentals across Rails, Backbone.js, and PostgreSQL.",
          "Led a small intern cohort and established the company's first code-review culture.",
        ],
      },
    ],
    snapshotsHeading: "Selected work snapshots",
    snapshotsIntro: "Visual placeholders for key deliverables from each chapter of my career.",
  },
  expertise: {
    eyebrow: "Leadership & Expertise",
    heading: "Technical depth with a human lens.",
    intro:
      "Staff engineering is where architecture, product sense, and people leadership intersect. I operate across all three.",
    principles: [
      { title: "Clarity over control", description: "I set clear goals and trust teams to own the how. My job is to remove ambiguity, not to micromanage." },
      { title: "Ship small, learn fast", description: "Big bets are decomposed into small, reversible experiments. Momentum and feedback matter more than perfect plans." },
      { title: "Invest in people", description: "The best systems are built by growing engineers. I prioritize mentorship, sponsorship, and psychological safety." },
    ],
    skillsHeading: "Core capabilities",
    skills: [
      { title: "Frontend Architecture", skills: ["React / Next.js", "TypeScript", "Design Systems", "Performance", "Accessibility"] },
      { title: "Backend & Infrastructure", skills: ["Node.js / Go", "PostgreSQL", "Redis", "Kafka", "Kubernetes"] },
      { title: "System Design", skills: ["Distributed Systems", "Event-Driven", "Micro-frontends", "API Design", "Observability"] },
      { title: "Leadership & Mentorship", skills: ["Team Growth", "Staff+ IC Track", "Technical Strategy", "Hiring", "Culture"] },
    ],
    metrics: [
      { value: "14", label: "Engineers mentored to senior+" },
      { value: "60%", label: "Latency reduction" },
      { value: "$2B+", label: "Annual payment volume" },
      { value: "8", label: "Years in staff+ roles" },
    ],
    highlightsHeading: "Capability highlights",
    highlightsIntro: "Placeholder visuals for system designs, team structures, and technical deep-dives.",
  },
  achievements: {
    eyebrow: "Achievements",
    heading: "Outcomes that speak louder than titles.",
    intro: "Selected projects, awards, and measurable impact from the last decade of building software.",
    items: [
      { title: "Real-time payment orchestration", organization: "Vertex Payments", description: "Architected an event-driven payment platform that routes transactions across multiple processors with sub-second failover.", metric: "$2B+ processed", tags: ["System Design", "Kafka", "Go"] },
      { title: "Seller workbench redesign", organization: "Nova Marketplace", description: "Rebuilt the core seller experience from a monolithic app into a micro-frontend suite, cutting release friction and improving UX.", metric: "80% faster builds", tags: ["Micro-frontends", "React", "Performance"] },
      { title: "Engineering excellence award", organization: "Vertex Payments", description: "Recognized for creating the incident-response playbook and observability standards that reduced critical incident MTTR by half.", metric: "50% lower MTTR", tags: ["Observability", "Leadership", "SRE"] },
      { title: "Checkout conversion uplift", organization: "Nova Marketplace", description: "Led a cross-functional effort to simplify the checkout flow, remove friction, and improve mobile completion rates.", metric: "+12% conversion", tags: ["Product", "UX", "A/B Testing"] },
      { title: "Open-source design system", organization: "Personal / Community", description: "Created and maintained an accessible React component library used by early-stage teams and side projects.", metric: "3k+ downloads/month", tags: ["Open Source", "Accessibility", "Design Systems"] },
      { title: "Latency optimization initiative", organization: "Vertex Payments", description: "Profiled and optimized critical payment paths, introducing edge caching and smarter database access patterns.", metric: "60% latency drop", tags: ["Performance", "Redis", "PostgreSQL"] },
    ],
    galleryHeading: "Project gallery",
    galleryIntro: "Placeholder previews for the work behind the metrics. Swap in screenshots, demos, or award photos.",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's build something meaningful.",
    intro: "I'm open to staff engineering roles, advisory work, and conversations about high-impact product engineering.",
    portraitCaption: "Available for meaningful engineering work.",
    successTitle: "Message sent",
    successText: "Thanks for reaching out. I'll get back to you as soon as possible.",
  },
};
