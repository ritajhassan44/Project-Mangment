import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, LayoutGrid, BarChart3, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobTrackr — Organize your job search and land offers" },
      { name: "description", content: "Track every job application from wishlist to offer with a visual pipeline and real-time analytics. Free and built for job seekers." },
      { property: "og:title", content: "JobTrackr — Organize your job search" },
      { property: "og:description", content: "A visual pipeline and analytics to manage your entire job hunt in one place." },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

const features = [
  { icon: LayoutGrid, title: "Visual pipeline", desc: "Drag your applications from wishlist to offer across a clean kanban board." },
  { icon: BarChart3, title: "Live analytics", desc: "See your conversion rates and pipeline health update in real time." },
  { icon: Target, title: "Never miss a follow-up", desc: "Keep notes, salaries, locations, and links in one organized place." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold">JobTrackr</span>
        </div>
        <Link to="/auth"><Button variant="hero">Get started</Button></Link>
      </header>

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Built for serious job seekers
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Land your next job <span className="text-gradient">without the chaos</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Stop juggling spreadsheets. Track every application, interview, and offer in one beautiful pipeline with built-in analytics.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/auth"><Button variant="hero" size="xl">Start tracking free <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/auth"><Button variant="outline" size="xl">Sign in</Button></Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {["No credit card", "Free forever", "Private & secure"].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> {t}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-40 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
            <img
              src={heroImg}
              alt="JobTrackr pipeline visualization with charts"
              width={1280}
              height={960}
              className="relative rounded-2xl border border-border shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold">Everything you need to stay on top</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          A complete command center for your job search.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center" style={{ background: "var(--gradient-hero)" }}>
          <h2 className="text-3xl font-bold">Ready to organize your job hunt?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">Join now and turn your scattered applications into a winning strategy.</p>
          <Link to="/auth"><Button variant="hero" size="xl" className="mt-7">Get started — it's free <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> JobTrackr</span>
          <span>© {new Date().getFullYear()} JobTrackr. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
