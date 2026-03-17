import { Skeleton } from "@/components/ui/skeleton";
import {
  type Assignment,
  type Subject,
  getWeekStart,
  nsToDate,
  useAssignments,
  useStudySessions,
  useSubjectStats,
  useSubjects,
  useWeeklyStats,
} from "@/hooks/useQueries";
import { BookOpen, Clock, Flame, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getRelativeDue(dueDate: Date): { label: string; urgent: boolean } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate(),
  );
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { label: "Overdue", urgent: true };
  if (diff === 0) return { label: "Today", urgent: true };
  if (diff === 1) return { label: "Tomorrow", urgent: true };
  if (diff <= 7) return { label: `In ${diff} days`, urgent: false };
  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    urgent: false,
  };
}

function greetingText(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Sub-Components ──────────────────────────────────────────────────────────

function WeeklyChart({
  dailyStats,
}: { dailyStats: { dayIndex: bigint; totalSeconds: bigint }[] }) {
  const today = new Date();
  const weekStart = getWeekStart();
  const todayIndex = Math.floor(
    (today.getTime() - weekStart.getTime()) / 86400000,
  );

  const data = DAY_LABELS.map((label, i) => {
    const stat = dailyStats.find((s) => Number(s.dayIndex) === i);
    return {
      label,
      hours: stat ? Number(stat.totalSeconds) / 3600 : 0,
      isToday: i === todayIndex,
    };
  });

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 0, bottom: 0, left: -28 }}
          barCategoryGap="20%"
        >
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 11,
              fill: "oklch(0.5 0.015 250)",
              fontFamily: "Figtree",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 10,
              fill: "oklch(0.5 0.015 250)",
              fontFamily: "Figtree",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v === 0 ? "" : `${v}h`)}
          />
          <Tooltip
            formatter={(value: number) => [
              `${value.toFixed(1)}h`,
              "Study time",
            ]}
            contentStyle={{
              background: "oklch(1 0 0)",
              border: "1px solid oklch(0.88 0.012 85)",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "Figtree",
              boxShadow: "0 4px 12px oklch(0.18 0.02 260 / 0.1)",
            }}
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.label}
                fill={
                  entry.isToday
                    ? "oklch(0.56 0.22 264)"
                    : entry.hours > 0
                      ? "oklch(0.72 0.15 264)"
                      : "oklch(0.92 0.008 85)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function UpcomingAssignmentRow({
  assignment,
  subject,
}: {
  assignment: Assignment;
  subject?: Subject;
}) {
  const due = nsToDate(assignment.dueDate);
  const { label, urgent } = getRelativeDue(due);

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className="subject-dot"
        style={{ backgroundColor: subject?.colorHex ?? "#999" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {assignment.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {subject?.name ?? "Unknown"}
        </p>
      </div>
      <span
        className={`text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full ${
          urgent
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DashboardTab() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: weeklyStats, isLoading: statsLoading } = useWeeklyStats();
  const { data: subjectStats } = useSubjectStats();
  const { data: sessions } = useStudySessions();

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const weeklyTotalSeconds = useMemo(() => {
    if (!weeklyStats) return 0;
    return weeklyStats.reduce((sum, d) => sum + Number(d.totalSeconds), 0);
  }, [weeklyStats]);

  // Streak: consecutive days (going back from today) with sessions
  const streak = useMemo(() => {
    if (!sessions || sessions.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDays = new Set(
      sessions.map((s) => {
        const d = nsToDate(s.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }),
    );
    let count = 0;
    let current = today.getTime();
    while (sessionDays.has(current)) {
      count++;
      current -= 86400000;
    }
    return count;
  }, [sessions]);

  // Upcoming assignments: next 3 not completed, sorted by due date
  const upcomingAssignments = useMemo(() => {
    if (!assignments) return [];
    const now = Date.now();
    return assignments
      .filter((a) => !a.completed && Number(a.dueDate) / 1e6 >= now - 86400000)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate))
      .slice(0, 3);
  }, [assignments]);

  // Per-subject breakdown this week
  const subjectBreakdown = useMemo(() => {
    if (!subjectStats || !subjects) return [];
    const total = subjectStats.reduce(
      (sum, s) => sum + Number(s.totalSeconds),
      0,
    );
    if (total === 0) return [];
    return subjectStats
      .map((ss) => {
        const subject = subjects.find((s) => s.id === ss.subjectId);
        return {
          subject,
          seconds: Number(ss.totalSeconds),
          pct: Math.round((Number(ss.totalSeconds) / total) * 100),
        };
      })
      .filter((s) => s.subject)
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 5);
  }, [subjectStats, subjects]);

  const subjectMap = useMemo(() => {
    const m = new Map<string, Subject>();
    for (const s of subjects ?? []) m.set(String(s.id), s);
    return m;
  }, [subjects]);

  const isLoading = subjectsLoading || assignmentsLoading || statsLoading;

  return (
    <div
      className="flex flex-col gap-4 px-4 py-5 pb-6 scroll-clean overflow-y-auto"
      data-ocid="dashboard.section"
      style={{ minHeight: 0, flex: 1 }}
    >
      {/* Header */}
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground font-medium">{dateStr}</p>
        <h1 className="text-2xl font-bold text-foreground mt-0.5">
          {greetingText()} 👋
        </h1>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-2 gap-3 animate-slide-up"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="card-elevated rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              This week
            </p>
            {isLoading ? (
              <Skeleton className="h-5 w-14 mt-0.5" />
            ) : (
              <p className="text-base font-bold text-foreground">
                {formatHours(weeklyTotalSeconds)}
              </p>
            )}
          </div>
        </div>
        <div className="card-elevated rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-study-amber/10 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-study-amber" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Streak</p>
            {isLoading ? (
              <Skeleton className="h-5 w-10 mt-0.5" />
            ) : (
              <p className="text-base font-bold text-foreground">
                {streak} {streak === 1 ? "day" : "days"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div
        className="card-elevated rounded-2xl p-4 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weekly Progress
          </h2>
          <span className="text-xs text-muted-foreground">Mon – Sun</span>
        </div>
        {statsLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : (
          <WeeklyChart dailyStats={weeklyStats ?? []} />
        )}
      </div>

      {/* Upcoming Assignments */}
      <div
        className="card-elevated rounded-2xl p-4 animate-slide-up"
        style={{ animationDelay: "0.15s" }}
      >
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-study-coral" />
          Upcoming Assignments
        </h2>
        {assignmentsLoading ? (
          <div className="flex flex-col gap-2 mt-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : upcomingAssignments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            🎉 No upcoming assignments!
          </p>
        ) : (
          <div className="divide-y divide-border/50">
            {upcomingAssignments.map((a) => (
              <UpcomingAssignmentRow
                key={String(a.id)}
                assignment={a}
                subject={subjectMap.get(String(a.subjectId))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subject Breakdown */}
      {subjectBreakdown.length > 0 && (
        <div
          className="card-elevated rounded-2xl p-4 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Subject Breakdown
          </h2>
          <div className="flex flex-col gap-3">
            {subjectBreakdown.map(({ subject, seconds, pct }) => (
              <div key={String(subject!.id)}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="subject-dot"
                      style={{ backgroundColor: subject!.colorHex }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {subject!.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatHours(seconds)} · {pct}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: subject!.colorHex,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer spacer */}
      <div className="h-2" />
    </div>
  );
}
