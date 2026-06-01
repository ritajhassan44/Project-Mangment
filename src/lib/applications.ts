import { supabase } from "@/integrations/supabase/client";

export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string | null;
  salary: string | null;
  url: string | null;
  notes: string | null;
  applied_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ApplicationInput = {
  company: string;
  position: string;
  status: ApplicationStatus;
  location?: string | null;
  salary?: string | null;
  url?: string | null;
  notes?: string | null;
  applied_date?: string | null;
};

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; color: string; dot: string }
> = {
  wishlist: { label: "Wishlist", color: "var(--muted-foreground)", dot: "oklch(0.68 0.03 258)" },
  applied: { label: "Applied", color: "var(--accent)", dot: "oklch(0.7 0.15 215)" },
  interview: { label: "Interview", color: "oklch(0.78 0.16 85)", dot: "oklch(0.78 0.16 85)" },
  offer: { label: "Offer", color: "var(--primary)", dot: "oklch(0.78 0.16 165)" },
  rejected: { label: "Rejected", color: "var(--destructive)", dot: "oklch(0.62 0.22 18)" },
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export async function fetchApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Application[];
}

export async function createApplication(input: ApplicationInput, userId: string) {
  const { error } = await supabase
    .from("applications")
    .insert({ ...input, user_id: userId });
  if (error) throw error;
}

export async function updateApplication(id: string, input: Partial<ApplicationInput>) {
  const { error } = await supabase.from("applications").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteApplication(id: string) {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}