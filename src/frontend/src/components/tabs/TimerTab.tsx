import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type StudySession,
  type Subject,
  nowNs,
  nsToDate,
  useLogStudySession,
  useStudySessions,
  useSubjects,
} from "@/hooks/useQueries";
import { CheckCircle2, Clock, Pause, Play, Square, Timer } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(seconds: number): { mm: string; ss: string } {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

const PRESETS = [
  { label: "Pomodoro", minutes: 25, icon: "🍅" },
  { label: "Short Break", minutes: 5, icon: "☕" },
  { label: "Long Break", minutes: 15, icon: "🌿" },
  { label: "Custom", minutes: 0, icon: "⚡" },
];

// ─── Session Item ─────────────────────────────────────────────────────────────

function RecentSessionItem({
  session,
  subject,
  index,
}: {
  session: StudySession;
  subject?: Subject;
  index: number;
}) {
  const date = nsToDate(session.date);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const dateLabel = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
      data-ocid={`timer.item.${index + 1}`}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${subject?.colorHex ?? "#999"}22` }}
      >
        <Clock
          className="w-4 h-4"
          style={{ color: subject?.colorHex ?? "#999" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {subject?.name ?? "Unknown"}
        </p>
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
      </div>
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {formatDuration(Number(session.durationSeconds))}
      </span>
    </div>
  );
}

// ─── Session Summary ──────────────────────────────────────────────────────────

function SessionSummary({
  subject,
  seconds,
  onDismiss,
}: {
  subject?: Subject;
  seconds: number;
  onDismiss: () => void;
}) {
  return (
    <div className="card-elevated rounded-2xl p-5 flex flex-col items-center gap-3 animate-scale-in">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${subject?.colorHex ?? "#7C5CBF"}22` }}
      >
        <CheckCircle2
          className="w-7 h-7"
          style={{ color: subject?.colorHex ?? "#7C5CBF" }}
        />
      </div>
      <div className="text-center">
        <p className="font-bold text-foreground text-lg">Session Complete!</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {subject?.name ?? "Study"} · {formatDuration(seconds)}
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="rounded-xl mt-1"
        onClick={onDismiss}
      >
        Dismiss
      </Button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TimerTab() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: sessions } = useStudySessions();
  const logSession = useLogStudySession();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused">(
    "idle",
  );
  const [elapsed, setElapsed] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(25 * 60);
  const [customMinutes, setCustomMinutes] = useState("25");
  const [presetKey, setPresetKey] = useState(0); // 0=pomodoro
  const [isCustom, setIsCustom] = useState(false);
  const [completedSession, setCompletedSession] = useState<{
    subject?: Subject;
    seconds: number;
  } | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const startElapsedRef = useRef<number>(0);

  // Count up from 0 (stopwatch style)
  // We intentionally omit `elapsed` from deps — we capture it in a ref on start
  // biome-ignore lint/correctness/useExhaustiveDependencies: startElapsedRef captures elapsed on start
  useEffect(() => {
    if (timerState === "running") {
      startTimeRef.current = Date.now();
      startElapsedRef.current = elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(
          startElapsedRef.current +
            Math.floor((Date.now() - startTimeRef.current) / 1000),
        );
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const selectedSubject = useMemo(
    () => subjects?.find((s) => String(s.id) === selectedSubjectId),
    [subjects, selectedSubjectId],
  );

  const recentSessions = useMemo(() => {
    if (!sessions) return [];
    return [...sessions]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 5);
  }, [sessions]);

  const subjectMap = useMemo(() => {
    const m = new Map<string, Subject>();
    for (const s of subjects ?? []) m.set(String(s.id), s);
    return m;
  }, [subjects]);

  const handleStart = useCallback(() => {
    if (!selectedSubjectId) {
      toast.error("Please select a subject first");
      return;
    }
    setTimerState("running");
  }, [selectedSubjectId]);

  const handlePause = useCallback(() => {
    setTimerState("paused");
  }, []);

  const handleStop = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState("idle");

    if (elapsed < 10) {
      setElapsed(0);
      return;
    }

    try {
      const durationSeconds = BigInt(elapsed);
      const now = nowNs();
      await logSession.mutateAsync({
        subjectId: BigInt(selectedSubjectId),
        durationSeconds,
        date: now,
      });
      setCompletedSession({ subject: selectedSubject, seconds: elapsed });
      toast.success("Session saved!");
    } catch {
      toast.error("Failed to save session");
    }

    setElapsed(0);
  }, [elapsed, selectedSubjectId, selectedSubject, logSession]);

  const handlePresetSelect = useCallback((minutes: number, index: number) => {
    if (index === 3) {
      setIsCustom(true);
      return;
    }
    setIsCustom(false);
    setPresetKey(index);
    setTargetSeconds(minutes * 60);
  }, []);

  const { mm, ss } = formatTime(elapsed);
  const progressPct =
    targetSeconds > 0 ? Math.min((elapsed / targetSeconds) * 100, 100) : 0;

  // Determine fill color for timer ring
  const subjectColor = selectedSubject?.colorHex ?? "oklch(0.56 0.22 264)";

  return (
    <div
      className="flex flex-col gap-5 px-4 py-5 pb-6 overflow-y-auto scroll-clean"
      style={{ flex: 1 }}
    >
      <h1 className="text-2xl font-bold text-foreground animate-fade-in">
        Study Timer
      </h1>

      {/* Subject selector */}
      <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
        {subjectsLoading ? (
          <Skeleton className="h-12 w-full rounded-xl" />
        ) : (
          <Select
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
            disabled={timerState !== "idle"}
          >
            <SelectTrigger
              className="h-12 rounded-xl text-base"
              data-ocid="timer.subject_select"
            >
              <SelectValue placeholder="Select a subject…" />
            </SelectTrigger>
            <SelectContent>
              {subjects?.map((s) => (
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
        )}
      </div>

      {/* Presets */}
      <div
        className="flex gap-2 animate-fade-in"
        style={{ animationDelay: "0.08s" }}
      >
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-150 border ${
              presetKey === i && !isCustom
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/60 border-transparent text-muted-foreground"
            }`}
            onClick={() => handlePresetSelect(p.minutes, i)}
            disabled={timerState !== "idle"}
          >
            <div className="text-base leading-none mb-0.5">{p.icon}</div>
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom duration input */}
      {isCustom && (
        <div className="flex items-center gap-3 animate-fade-in">
          <label
            htmlFor="custom-minutes"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Target (min):
          </label>
          <input
            id="custom-minutes"
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => {
              setCustomMinutes(e.target.value);
              const mins = Number.parseInt(e.target.value) || 0;
              setTargetSeconds(mins * 60);
            }}
            className="flex-1 h-10 rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
            disabled={timerState !== "idle"}
          />
        </div>
      )}

      {/* Timer Display */}
      <div
        className="card-elevated rounded-3xl p-6 flex flex-col items-center gap-5 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Circular progress ring */}
        <div className="relative w-48 h-48">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
            role="img"
            aria-label="Study timer progress"
          >
            <title>Study timer progress</title>
            {/* Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="oklch(0.92 0.008 85)"
              strokeWidth="6"
            />
            {/* Progress */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={subjectColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPct / 100)}`}
              style={{
                transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
              }}
            />
          </svg>
          {/* Time text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="timer-display text-5xl font-bold text-foreground leading-none flex items-baseline">
              <span>{mm}</span>
              <span className={timerState === "running" ? "colon-blink" : ""}>
                :
              </span>
              <span>{ss}</span>
            </div>
            {selectedSubject && (
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedSubject.colorHex }}
                />
                <span className="text-xs text-muted-foreground">
                  {selectedSubject.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 w-full justify-center">
          {timerState === "idle" && (
            <Button
              size="lg"
              className="flex-1 max-w-[200px] h-14 rounded-2xl text-base gap-2 shadow-[0_4px_20px_oklch(0.56_0.22_264/0.35)]"
              onClick={handleStart}
              disabled={!selectedSubjectId}
              data-ocid="timer.start_button"
            >
              <Play className="w-5 h-5 fill-current" />
              Start
            </Button>
          )}
          {timerState === "running" && (
            <>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 max-w-[140px] h-14 rounded-2xl text-base gap-2"
                onClick={handlePause}
                data-ocid="timer.pause_button"
              >
                <Pause className="w-5 h-5" />
                Pause
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="flex-1 max-w-[140px] h-14 rounded-2xl text-base gap-2"
                onClick={handleStop}
                data-ocid="timer.stop_button"
              >
                <Square className="w-5 h-5 fill-current" />
                Stop
              </Button>
            </>
          )}
          {timerState === "paused" && (
            <>
              <Button
                size="lg"
                className="flex-1 max-w-[140px] h-14 rounded-2xl text-base gap-2"
                onClick={handleStart}
                data-ocid="timer.start_button"
              >
                <Play className="w-5 h-5 fill-current" />
                Resume
              </Button>
              <Button
                size="lg"
                variant="destructive"
                className="flex-1 max-w-[140px] h-14 rounded-2xl text-base gap-2"
                onClick={handleStop}
                data-ocid="timer.stop_button"
              >
                <Square className="w-5 h-5 fill-current" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Session Summary */}
      {completedSession && (
        <SessionSummary
          subject={completedSession.subject}
          seconds={completedSession.seconds}
          onDismiss={() => setCompletedSession(null)}
        />
      )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div
          className="card-elevated rounded-2xl p-4 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4 text-primary" />
            Recent Sessions
          </h2>
          <div>
            {recentSessions.map((session, i) => (
              <RecentSessionItem
                key={String(session.id)}
                session={session}
                subject={subjectMap.get(String(session.subjectId))}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
