import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, FolderKanban, Inbox, Plus, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/api/admin-api";
import { isRead } from "@/api/admin-types";

export default function Dashboard() {
  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: adminApi.projects.list });
  const experiences = useQuery({ queryKey: ["admin", "experiences"], queryFn: adminApi.experiences.list });
  const achievements = useQuery({ queryKey: ["admin", "achievements"], queryFn: adminApi.achievements.list });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: adminApi.messages.list });
  const profile = useQuery({ queryKey: ["admin", "profile"], queryFn: adminApi.profile.get });

  const n = (q: { data?: unknown[] }) => q.data?.length ?? "—";
  const unread = messages.data ? messages.data.filter((m) => !isRead(m)).length : "—";
  const firstName = profile.data?.name?.split(" ")[0];

  const stats = [
    { label: "Projects", value: n(projects) },
    { label: "Experience entries", value: n(experiences) },
    { label: "Achievements", value: n(achievements) },
    { label: "Unread messages", value: unread },
  ];

  const cards = [
    { to: "/admin/profile", icon: UserRound, title: "Profile", text: "Hero, photo, quote and contact details." },
    { to: "/admin/projects", icon: FolderKanban, title: "Projects", text: "Case studies, images and links." },
    { to: "/admin/experiences", icon: Briefcase, title: "Experience", text: "Roles and highlights." },
    { to: "/admin/achievements", icon: Trophy, title: "Achievements", text: "Milestones and metrics." },
    { to: "/admin/messages", icon: Inbox, title: "Messages", text: "Read what visitors sent you." },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Dashboard</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
        Welcome back{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="mt-2 text-muted-foreground">Changes you save here update the live site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-heading text-3xl font-bold text-accent">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ to, icon: Icon, title, text }) => (
          <Link key={to} to={to} className="group rounded-xl border border-border bg-card p-6 hover:border-accent/40">
            <Icon className="h-6 w-6 text-accent" />
            <h2 className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-accent">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link to="/admin/projects/new"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>
    </div>
  );
}