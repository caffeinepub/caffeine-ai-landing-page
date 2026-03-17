import type {
  Assignment,
  DailyStats,
  StudySession,
  Subject,
  SubjectStats,
} from "@/backend.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export type { Subject, Assignment, StudySession, DailyStats, SubjectStats };

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function nowNs(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}

export function nsToMs(ns: bigint): number {
  return Number(ns) / 1e6;
}

export function nsToDate(ns: bigint): Date {
  return new Date(nsToMs(ns));
}

export function dateToNs(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // make Mon day 0
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Subjects ────────────────────────────────────────────────────────────────

export function useSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, colorHex }: { name: string; colorHex: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addSubject(name, colorHex);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useUpdateSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      colorHex,
    }: { id: bigint; name: string; colorHex: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSubject(id, name, colorHex);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["subjects"] });
      void qc.invalidateQueries({ queryKey: ["subjectStats"] });
    },
  });
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export function useAssignments() {
  const { actor, isFetching } = useActor();
  return useQuery<Assignment[]>({
    queryKey: ["assignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssignments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAssignment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      subjectId,
      title,
      description,
      dueDate,
    }: {
      subjectId: bigint;
      title: string;
      description: string;
      dueDate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAssignment(subjectId, title, description, dueDate);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useUpdateAssignment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      dueDate,
    }: {
      id: bigint;
      title: string;
      description: string;
      dueDate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAssignment(id, title, description, dueDate);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useToggleAssignment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleAssignment(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

export function useDeleteAssignment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAssignment(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

// ─── Study Sessions ───────────────────────────────────────────────────────────

export function useStudySessions() {
  const { actor, isFetching } = useActor();
  return useQuery<StudySession[]>({
    queryKey: ["studySessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudySessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWeeklyStats(weekStart?: Date) {
  const { actor, isFetching } = useActor();
  const start = weekStart ?? getWeekStart();
  return useQuery<DailyStats[]>({
    queryKey: ["weeklyStats", start.toISOString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWeeklyStats(dateToNs(start));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubjectStats() {
  const { actor, isFetching } = useActor();
  return useQuery<SubjectStats[]>({
    queryKey: ["subjectStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjectStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogStudySession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      subjectId,
      durationSeconds,
      date,
    }: {
      subjectId: bigint;
      durationSeconds: bigint;
      date: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logStudySession(subjectId, durationSeconds, date);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["studySessions"] });
      void qc.invalidateQueries({ queryKey: ["weeklyStats"] });
      void qc.invalidateQueries({ queryKey: ["subjectStats"] });
    },
  });
}
