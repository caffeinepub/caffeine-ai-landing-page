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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Subject,
  useAddSubject,
  useDeleteSubject,
  useSubjectStats,
  useSubjects,
  useUpdateSubject,
} from "@/hooks/useQueries";
import {
  BookOpen,
  Clock,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { label: "Coral", hex: "#E05B5B" },
  { label: "Indigo", hex: "#7C5CBF" },
  { label: "Emerald", hex: "#3DAA72" },
  { label: "Amber", hex: "#D4960E" },
  { label: "Violet", hex: "#8B5CF6" },
  { label: "Sky", hex: "#3B9EBF" },
  { label: "Rose", hex: "#E0466B" },
  { label: "Teal", hex: "#2DA89E" },
];

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0 && m === 0) return "0m";
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── Subject Form Sheet ───────────────────────────────────────────────────────

function SubjectFormSheet({
  open,
  onOpenChange,
  editSubject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editSubject?: Subject;
}) {
  const [name, setName] = useState(editSubject?.name ?? "");
  const [color, setColor] = useState(
    editSubject?.colorHex ?? PRESET_COLORS[0].hex,
  );
  const addMutation = useAddSubject();
  const updateMutation = useUpdateSubject();

  const isEditing = !!editSubject;
  const isPending = addMutation.isPending || updateMutation.isPending;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      try {
        if (isEditing) {
          await updateMutation.mutateAsync({
            id: editSubject.id,
            name: name.trim(),
            colorHex: color,
          });
          toast.success("Subject updated!");
        } else {
          await addMutation.mutateAsync({ name: name.trim(), colorHex: color });
          toast.success("Subject added!");
        }
        onOpenChange(false);
        setName("");
        setColor(PRESET_COLORS[0].hex);
      } catch {
        toast.error("Something went wrong");
      }
    },
    [
      name,
      color,
      isEditing,
      editSubject,
      addMutation,
      updateMutation,
      onOpenChange,
    ],
  );

  // Reset form when sheet opens with edit subject
  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v && editSubject) {
        setName(editSubject.name);
        setColor(editSubject.colorHex);
      } else if (!v) {
        setName("");
        setColor(PRESET_COLORS[0].hex);
      }
      onOpenChange(v);
    },
    [editSubject, onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8">
        <SheetHeader className="text-left mb-5">
          <SheetTitle>{isEditing ? "Edit Subject" : "Add Subject"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject-name">Subject name</Label>
            <Input
              id="subject-name"
              placeholder="e.g. Mathematics, Biology..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              data-ocid="subject_form.input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className="w-8 h-8 rounded-full transition-all duration-150 hover:scale-110 focus:outline-none"
                  style={{
                    backgroundColor: c.hex,
                    boxShadow:
                      color === c.hex
                        ? `0 0 0 3px white, 0 0 0 5px ${c.hex}`
                        : "none",
                  }}
                  onClick={() => setColor(c.hex)}
                  aria-label={c.label}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
              data-ocid="subject_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!name.trim() || isPending}
              data-ocid="subject_form.submit_button"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Subject"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ─── Subject Card ─────────────────────────────────────────────────────────────

function SubjectCard({
  subject,
  weekSeconds,
  index,
  onEdit,
  onDelete,
}: {
  subject: Subject;
  weekSeconds: number;
  index: number;
  onEdit: (s: Subject) => void;
  onDelete: (s: Subject) => void;
}) {
  return (
    <div
      className="card-elevated rounded-2xl p-4 flex items-center gap-4 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      data-ocid={`subjects.item.${index + 1}`}
    >
      {/* Color swatch */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${subject.colorHex}22` }}
      >
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: subject.colorHex }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{subject.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {formatHours(weekSeconds)} this week
          </p>
        </div>
      </div>

      {/* Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Subject options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => onEdit(subject)}
            data-ocid="subject.edit_button"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(subject)}
            className="text-destructive"
            data-ocid="subject.delete_button"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SubjectsTab() {
  const { data: subjects, isLoading } = useSubjects();
  const { data: subjectStats } = useSubjectStats();
  const deleteMutation = useDeleteSubject();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Subject | undefined>();

  const secondsMap = new Map(
    (subjectStats ?? []).map((s) => [
      String(s.subjectId),
      Number(s.totalSeconds),
    ]),
  );

  const handleEdit = useCallback((s: Subject) => {
    setEditSubject(s);
    setSheetOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((s: Subject) => {
    setDeleteTarget(s);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch {
      toast.error("Failed to delete subject");
    }
    setDeleteTarget(undefined);
  }, [deleteTarget, deleteMutation]);

  const handleSheetOpen = useCallback((v: boolean) => {
    if (!v) setEditSubject(undefined);
    setSheetOpen(v);
  }, []);

  return (
    <div
      className="flex flex-col gap-4 px-4 py-5 pb-6 overflow-y-auto scroll-clean"
      style={{ flex: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
        <Button
          size="sm"
          className="gap-1.5 rounded-xl"
          onClick={() => {
            setEditSubject(undefined);
            setSheetOpen(true);
          }}
          data-ocid="subjects.add_button"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : !subjects || subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No subjects yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first subject to get started
            </p>
          </div>
          <Button
            size="sm"
            className="mt-2 gap-1.5"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3" data-ocid="subjects.list">
          {subjects.map((subject, i) => (
            <SubjectCard
              key={String(subject.id)}
              subject={subject}
              weekSeconds={secondsMap.get(String(subject.id)) ?? 0}
              index={i}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Sheet */}
      <SubjectFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpen}
        editSubject={editSubject}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject and all its associated study
              sessions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="subject_form.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="subject.delete_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
