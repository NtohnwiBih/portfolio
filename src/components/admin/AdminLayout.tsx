import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, UserRound, Briefcase, Trophy, Link2, Inbox, ExternalLink, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/profile", label: "Profile", icon: UserRound, end: false },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, end: false },
  { to: "/admin/experiences", label: "Experience", icon: Briefcase, end: false },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy, end: false },
  { to: "/admin/social-links", label: "Social links", icon: Link2, end: false },
  { to: "/admin/messages", label: "Messages", icon: Inbox, end: false },
];

/** Sets the title and a noindex robots tag while the admin area is mounted. */
export function useAdminHead(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, [title]);
}

export default function AdminLayout() {
  useAdminHead("Admin CMS — Ntohnwi Bih");
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <aside className="border-b border-border bg-card md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/admin" className="font-heading text-lg font-bold text-foreground">
            NB<span className="text-primary">.</span>{" "}
            <span className="text-sm font-medium text-accent">CMS</span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <Link
            to="/"
            className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary md:mt-6"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="justify-start gap-2 px-3 text-muted-foreground"
            onClick={async () => {
              await logout();
              navigate("/admin/login", { replace: true });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </nav>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}