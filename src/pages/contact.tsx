import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import portraitImage from "@/assets/developer-portrait.jpeg";
import { api, ApiError } from "@/api/client";
import type { LayoutContext } from "@/components/Layout";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const { home } = useOutletContext<LayoutContext>();
  const profile = home?.profile;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Contact — Ntohnwi Bih";
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await api.sendContactMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const GithubIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.870 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );

  const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">
              Contact
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Let's build something meaningful.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {profile?.contact_intro ??
                "I'm open to staff engineering roles, advisory work, and conversations about high-impact product engineering."}
            </p>

            <div className="mt-10 space-y-6">
              {profile?.email && (
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-base font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                      className="text-base font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base font-medium text-foreground">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>

            {home?.social_links && home.social_links.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-medium text-muted-foreground">Connect</p>
                <div className="mt-4 flex gap-4">
                  {home.social_links.map((link) => {
                    const Icon =
                      link.platform.toLowerCase() === "github"
                        ? GithubIcon
                        : link.platform.toLowerCase() === "linkedin"
                          ? LinkedinIcon
                          : XIcon;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-accent/30 hover:text-accent"
                        aria-label={link.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10">
              <figure className="max-w-sm overflow-hidden rounded-lg border border-border bg-card">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={profile?.photo_url ?? portraitImage}
                    alt={profile?.name ?? "Developer portrait"}
                    className="h-full w-full object-cover object-[center_30%]"
                    loading="lazy"
                  />
                </div>
                <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                  Available for meaningful engineering work.
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-card-foreground">
                  Message sent
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thanks for reaching out. I'll get back to you as soon as possible.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about the opportunity or project..."
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>

                {status === "error" && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}