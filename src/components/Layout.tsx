import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useHome } from "@/hooks/use-api";
import type { HomeData } from "@/api/types";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" }, 
  { to: "/expertise", label: "Expertise" },
  { to: "/achievements", label: "Achievements" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-heading text-xl font-bold tracking-tight text-foreground">
          NB<span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-background px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-accent/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

function Footer({ data }: { data: HomeData | undefined }) {
  const links = data?.social_links?.length
    ? data.social_links
    : [
        { id: -1, platform: "GitHub", url: "https://github.com" },
        { id: -2, platform: "LinkedIn", url: "https://linkedin.com" },
        { id: -3, platform: "Twitter", url: "https://twitter.com" },
      ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {data?.profile?.name ?? "Ntohnwi Bih"}.{" "}
          {data?.profile?.footer_text ?? "Built with intention."}
        </p>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export type LayoutContext = { home: HomeData | undefined };

export default function Layout() {
  const { data } = useHome();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet context={{ home: data } satisfies LayoutContext} />
      </main>
      <Footer data={data} />
    </div>
  );
}