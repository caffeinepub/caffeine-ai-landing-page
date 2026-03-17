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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  type Assignment,
  type Subject,
  dateToNs,
  nsToDate,
  useAddAssignment,
  useAssignments,
  useDeleteAssignment,
  useSubjects,
  useToggleAssignment,
} from "@/hooks/useQueries";
import { AlertCircle, ClipboardList, Plus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGroupLabel(
  dueDate: Date,
): "overdue" | "today" | "tomorrow" | "week" | "later" {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff <= 7) return "week";
  return "later";
}

const GROUP_META = {
  overdue: {
    label: "Overdue",
    color: "text-destructive",
    bg: "bg-destructive/5",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  today: {
    label: "Today",
    color: "text-study-amber",
    bg: "bg-study-amber/5",
    icon: null,
  },
  tomorrow: {
    label: "Tomorrow",
    color: "text-primary",
    bg: "bg-primary/5",
    icon: null,
  },
  week: {
    label: "This Week",
    color: "text-study-teal",
    bg: "bg-study-teal/5",
    icon: null,
  },
  later: {
    label: "Later",
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    icon: null,
  },
} as const;

type Group = keyof typeof GROUP_META;

function formatDueDateDisplay(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0)
    return `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} ago`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff <= 7) return `${diff} days`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Assignment Row ───────────────────────────────────────────────────────────

function AssignmentRow({
  assignment,
  subject,
  index,
  onToggle,
  onDelete,
}: {
  assignment: Assignment;
  subject?: Subject;
  index: number;
  onToggle: (id: bigint) => void;
  onDelete: (assignment: Assignment) => void;
}) {
  const dueDate = nsToDate(assignment.dueDate);
  const dueLabelStr = formatDueDateDisplay(dueDate);
  const isOverdue =
    getGroupLabel(dueDate) === "overdue" && !assignment.completed;

  return (
    <div
      className={`flex items-start gap-3 py-3 px-1 border-b border-border/40 last:border-0 transition-opacity ${
        assignment.completed ? "opacity-50" : ""
      }`}
      data-ocid={`assignment.item.${index + 1}`}
    >
      <div className="pt-0.5">
        <Checkbox
          checked={assignment.completed}
          onCheckedChange={() => onToggle(assignment.id)}
          className="w-5 h-5"
          data-ocid={`assignment.checkbox.${index + 1}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            assignment.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {assignment.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {subject && (
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: subject.colorHex }}
              />
              <span className="text-xs text-muted-foreground">
                {subject.name}
              </span>
            </div>
          )}
          <span
            className={`text-xs font-medium ${
              isOverdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {dueLabelStr}
          </span>
        </div>
        {assignment.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {assignment.description}
          </p>
        )}
      </div>
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
        onClick={() => onDelete(assignment)}
        aria-label="Delete assignment"
        data-ocid={`assignment.delete_button.${index + 1}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Assignment Form Sheet ────────────────────────────────────────────────────

function AssignmentFormSheet({
  open,
  onOpenChange,
  subjects,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjects: Subject[];
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const addMutation = useAddAssignment();
  const isPending = addMutation.isPending;

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setSubjectId("");
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setDueDate(d.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !subjectId || !dueDate) return;

      try {
        const dueDateNs = dateToNs(new Date(`${dueDate}T00:00:00`));
        await addMutation.mutateAsync({
          subjectId: BigInt(subjectId),
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDateNs,
        });
        toast.success("Assignment added!");
        onOpenChange(false);
        reset();
      } catch {
        toast.error("Failed to add assignment");
      }
    },
    [title, description, subjectId, dueDate, addMutation, onOpenChange, reset],
  );

  const handleClose = useCallback(
    (v: boolean) => {
      if (!v) reset();
      onOpenChange(v);
    },
    [onOpenChange, reset],
  );

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl pb-8 max-h-[90dvh] overflow-y-auto"
      >
        <SheetHeader className="text-left mb-5">
          <SheetTitle>Add Assignment</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="assignment-title">Title *</Label>
            <Input
              id="assignment-title"
              placeholder="e.g. Chapter 5 problems..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              data-ocid="assignment_form.input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="assignment-desc">Description</Label>
            <Textarea
              id="assignment-desc"
              placeholder="Optional notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
              data-ocid="assignment_form.textarea"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Subject *</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger data-ocid="assignment_form.select">
                <SelectValue placeholder="Choose subject…" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={String(s.id)} value={String(s.id)}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: s.colorHex }}
                      />
                      {s.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="assignment-due">Due Date *</Label>
            <input
              id="assignment-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleClose(false)}
              data-ocid="assignment_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!title.trim() || !subjectId || !dueDate || isPending}
              data-ocid="assignment_form.submit_button"
            >
              {isPending ? "Adding..." : "Add Assignment"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ─── Group Section ────────────────────────────────────────────────────────────

function GroupSection({
  group,
  items,
  subjects,
  startIndex,
  onToggle,
  onDelete,
}: {
  group: Group;
  items: Assignment[];
  subjects: Map<string, Subject>;
  startIndex: number;
  onToggle: (id: bigint) => void;
  onDelete: (a: Assignment) => void;
}) {
  const meta = GROUP_META[group];
  if (items.length === 0) return null;

  return (
    <div className="animate-fade-in">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-1 ${meta.bg}`}
      >
        <span className={meta.color}>{meta.icon}</span>
        <h3
          className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}
        >
          {meta.label}
        </h3>
        <span className={`text-xs font-semibold ml-auto ${meta.color}`}>
          {items.length}
        </span>
      </div>
      <div className="card-elevated rounded-2xl px-4 mb-4">
        {items.map((a, i) => (
          <AssignmentRow
            key={String(a.id)}
            assignment={a}
            subject={subjects.get(String(a.subjectId))}
            index={startIndex + i}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AssignmentsTab() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const toggleMutation = useToggleAssignment();
  const deleteMutation = useDeleteAssignment();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | undefined>();
  const [showCompleted, setShowCompleted] = useState(false);

  const subjectMap = useMemo(() => {
    const m = new Map<string, Subject>();
    for (const s of subjects ?? []) m.set(String(s.id), s);
    return m;
  }, [subjects]);

  // Group assignments
  const groups = useMemo(() => {
    if (!assignments) return {} as Record<Group, Assignment[]>;
    const g: Record<Group, Assignment[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      week: [],
      later: [],
    };
    for (const a of assignments) {
      if (a.completed && !showCompleted) continue;
      const group = getGroupLabel(nsToDate(a.dueDate));
      g[group].push(a);
    }
    // Sort each group by due date
    for (const k of Object.keys(g)) {
      g[k as Group].sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
    }
    return g;
  }, [assignments, showCompleted]);

  const totalActive = useMemo(
    () => (assignments ?? []).filter((a) => !a.completed).length,
    [assignments],
  );

  const handleToggle = useCallback(
    async (id: bigint) => {
      try {
        await toggleMutation.mutateAsync(id);
      } catch {
        toast.error("Failed to update assignment");
      }
    },
    [toggleMutation],
  );

  const handleDeleteRequest = useCallback((a: Assignment) => {
    setDeleteTarget(a);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Assignment deleted");
    } catch {
      toast.error("Failed to delete assignment");
    }
    setDeleteTarget(undefined);
  }, [deleteTarget, deleteMutation]);

  const isLoading = subjectsLoading || assignmentsLoading;

  // Running index for deterministic markers
  let rowIndex = 0;

  const groupOrder: Group[] = ["overdue", "today", "tomorrow", "week", "later"];

  return (
    <div
      className="flex flex-col gap-4 px-4 py-5 pb-24 overflow-y-auto scroll-clean"
      style={{ flex: 1, position: "relative" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          {totalActive > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalActive} pending
            </p>
          )}
        </div>
        <button
          type="button"
          className="text-xs text-primary font-semibold px-3 py-1.5 rounded-xl bg-primary/8 transition-colors hover:bg-primary/15"
          onClick={() => setShowCompleted((v) => !v)}
        >
          {showCompleted ? "Hide done" : "Show done"}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : !assignments || assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-study-emerald/10 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-study-emerald" />
          </div>
          <div>
            <p className="font-semibold text-foreground">All clear!</p>
            <p className="text-sm text-muted-foreground mt-1">
              No assignments yet. Add one to get started.
            </p>
          </div>
        </div>
      ) : (
        <div data-ocid="assignments.list">
          {groupOrder.map((group) => {
            const items = groups[group] ?? [];
            if (items.length === 0) return null;
            const start = rowIndex;
            rowIndex += items.length;
            return (
              <GroupSection
                key={group}
                group={group}
                items={items}
                subjects={subjectMap}
                startIndex={start}
                onToggle={handleToggle}
                onDelete={handleDeleteRequest}
              />
            );
          })}
          {Object.values(groups).every((g) => g.length === 0) && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No active assignments. 🎉
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-fab transition-transform active:scale-95 hover:scale-105"
        onClick={() => setSheetOpen(true)}
        style={{ maxWidth: "calc(430px / 2 + 430px / 2 - 16px)" }}
        aria-label="Add assignment"
        data-ocid="assignments.add_button"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Sheet */}
      <AssignmentFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        subjects={subjects ?? []}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="assignment_form.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
