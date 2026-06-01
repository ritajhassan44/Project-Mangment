import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Application,
  type ApplicationInput,
  type ApplicationStatus,
  STATUS_META,
  STATUS_ORDER,
} from "@/lib/applications";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Application | null;
  defaultStatus?: ApplicationStatus;
  onSubmit: (input: ApplicationInput) => Promise<void>;
}

const empty: ApplicationInput = {
  company: "",
  position: "",
  status: "wishlist",
  location: "",
  salary: "",
  url: "",
  notes: "",
  applied_date: "",
};

export function ApplicationDialog({ open, onOpenChange, initial, defaultStatus, onSubmit }: Props) {
  const [form, setForm] = useState<ApplicationInput>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              company: initial.company,
              position: initial.position,
              status: initial.status,
              location: initial.location ?? "",
              salary: initial.salary ?? "",
              url: initial.url ?? "",
              notes: initial.notes ?? "",
              applied_date: initial.applied_date ?? "",
            }
          : { ...empty, status: defaultStatus ?? "wishlist" },
      );
    }
  }, [open, initial, defaultStatus]);

  const set = (k: keyof ApplicationInput, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        location: form.location || null,
        salary: form.salary || null,
        url: form.url || null,
        notes: form.notes || null,
        applied_date: form.applied_date || null,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>Track every detail of your opportunity.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input value={form.position} onChange={(e) => set("position", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Applied date</Label>
              <Input type="date" value={form.applied_date ?? ""} onChange={(e) => set("applied_date", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Remote / Berlin" />
            </div>
            <div className="space-y-1.5">
              <Label>Salary</Label>
              <Input value={form.salary ?? ""} onChange={(e) => set("salary", e.target.value)} placeholder="$90k–110k" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Job link</Label>
            <Input value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Recruiter contact, interview prep, etc." />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="hero" disabled={saving}>{initial ? "Save changes" : "Add application"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}