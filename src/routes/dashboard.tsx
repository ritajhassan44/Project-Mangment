import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  LogOut,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  TrendingUp,
  Target,
  Trophy,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApplicationDialog } from "@/components/dashboard/ApplicationDialog";
import {
  type Application,
  type ApplicationInput,
  type ApplicationStatus,
  STATUS_META,
  STATUS_ORDER,
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "@/lib/applications";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — JobTrackr" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>("wishlist");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
    enabled: !!user,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["applications"] });

  const createMut = useMutation({
    mutationFn: (input: ApplicationInput) => createApplication(input, user!.id),
    onSuccess: () => { invalidate(); toast.success("Application added"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ApplicationInput> }) => updateApplication(id, input),
    onSuccess: () => { invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => { invalidate(); toast.success("Application removed"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter((a) => ["applied", "interview"].includes(a.status)).length;
    const interviews = apps.filter((a) => a.status === "interview").length;
    const offers = apps.filter((a) => a.status === "offer").length;
    return { total, active, interviews, offers };
  }, [apps]);

  const grouped = useMemo(() => {
    const map: Record<ApplicationStatus, Application[]> = {
      wishlist: [], applied: [], interview: [], offer: [], rejected: [],
    };
    apps.forEach((a) => map[a.status].push(a));
    return map;
  }, [apps]);

  const chartData = STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    value: grouped[s].length,
    fill: STATUS_META[s].dot,
  })).filter((d) => d.value > 0);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Briefcase className="h-4.5 w-4.5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">JobTrackr</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="hero" onClick={() => { setEditing(null); setDefaultStatus("wishlist"); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> Add
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Your job search</h1>
          <p className="text-sm text-muted-foreground">Track applications from wishlist to offer.</p>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Target className="h-5 w-5" />} label="Total applications" value={stats.total} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="In progress" value={stats.active} />
          <StatCard icon={<Briefcase className="h-5 w-5" />} label="Interviews" value={stats.interviews} />
          <StatCard icon={<Trophy className="h-5 w-5" />} label="Offers" value={stats.offers} accent />
        </section>

        {apps.length > 0 && (
          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Pipeline breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {chartData.map((d, i) => <Cell key={i} fill={d.fill} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {chartData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} /> {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Applications by stage</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.04)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <section className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : apps.length === 0 ? (
            <EmptyState onAdd={() => { setEditing(null); setDialogOpen(true); }} />
          ) : (
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex flex-col rounded-2xl border border-border bg-card/40 p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_META[status].dot }} />
                      {STATUS_META[status].label}
                    </span>
                    <span className="text-xs text-muted-foreground">{grouped[status].length}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5">
                    {grouped[status].map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        onEdit={() => { setEditing(app); setDialogOpen(true); }}
                        onDelete={() => setDeleteId(app.id)}
                        onMove={(s) => updateMut.mutate({ id: app.id, input: { status: s } })}
                      />
                    ))}
                    <button
                      onClick={() => { setEditing(null); setDefaultStatus(status); setDialogOpen(true); }}
                      className="rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        defaultStatus={defaultStatus}
        onSubmit={async (input) => {
          if (editing) {
            await updateMut.mutateAsync({ id: editing.id, input });
            toast.success("Application updated");
          } else {
            await createMut.mutateAsync(input);
          }
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteMut.mutate(deleteId); setDeleteId(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--popover-foreground)",
  fontSize: "12px",
};

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={accent ? { background: "var(--gradient-primary)", color: "var(--primary-foreground)" } : { background: "var(--secondary)", color: "var(--primary)" }}
      >
        {icon}
      </span>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function AppCard({ app, onEdit, onDelete, onMove }: {
  app: Application;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (s: ApplicationStatus) => void;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{app.position}</p>
          <p className="truncate text-xs text-muted-foreground">{app.company}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-md px-1.5 text-muted-foreground hover:text-foreground">⋯</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
            {STATUS_ORDER.filter((s) => s !== app.status).map((s) => (
              <DropdownMenuItem key={s} onClick={() => onMove(s)}>
                <span className="h-2 w-2 rounded-full" style={{ background: STATUS_META[s].dot }} /> Move to {STATUS_META[s].label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {(app.location || app.salary) && (
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {app.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>}
          {app.salary && <span>{app.salary}</span>}
        </div>
      )}
      {app.url && (
        <a href={app.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
          <ExternalLink className="h-3 w-3" /> Job posting
        </a>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--gradient-primary)" }}>
        <Briefcase className="h-6 w-6 text-primary-foreground" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">No applications yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Add your first job application and start building your pipeline.</p>
      <Button variant="hero" className="mt-5" onClick={onAdd}><Plus className="h-4 w-4" /> Add application</Button>
    </div>
  );
}