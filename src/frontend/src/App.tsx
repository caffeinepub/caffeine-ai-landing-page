import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { LoginScreen } from "./components/LoginScreen";
import { AssignmentsTab } from "./components/tabs/AssignmentsTab";
import { DashboardTab } from "./components/tabs/DashboardTab";
import { SubjectsTab } from "./components/tabs/SubjectsTab";
import { TimerTab } from "./components/tabs/TimerTab";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { nsToDate, useAssignments } from "./hooks/useQueries";

// ─── Notification helper ─────────────────────────────────────────────────────

function useBrowserNotifications() {
  const { data: assignments } = useAssignments();

  useEffect(() => {
    if (!assignments || assignments.length === 0) return;
    if (!("Notification" in window)) return;

    const alreadyShown = sessionStorage.getItem("notif-shown");
    if (alreadyShown) return;

    const checkAndNotify = async () => {
      let permission = Notification.permission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }
      if (permission !== "granted") return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dueToday = assignments.filter((a) => {
        if (a.completed) return false;
        const d = nsToDate(a.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });

      const dueTomorrow = assignments.filter((a) => {
        if (a.completed) return false;
        const d = nsToDate(a.dueDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === tomorrow.getTime();
      });

      if (dueToday.length > 0) {
        new Notification("StudyTrack — Due Today 📚", {
          body:
            dueToday.length === 1
              ? `"${dueToday[0].title}" is due today!`
              : `${dueToday.length} assignments are due today!`,
          icon: "/favicon.ico",
        });
      }

      if (dueTomorrow.length > 0) {
        setTimeout(() => {
          new Notification("StudyTrack — Due Tomorrow ⏰", {
            body:
              dueTomorrow.length === 1
                ? `"${dueTomorrow[0].title}" is due tomorrow.`
                : `${dueTomorrow.length} assignments are due tomorrow.`,
            icon: "/favicon.ico",
          });
        }, 2000);
      }

      sessionStorage.setItem("notif-shown", "1");
    };

    void checkAndNotify();
  }, [assignments]);
}

// ─── App Shell ───────────────────────────────────────────────────────────────

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { data: assignments } = useAssignments();
  useBrowserNotifications();

  const pendingCount = useMemo(
    () =>
      (assignments ?? []).filter((a) => {
        if (a.completed) return false;
        const d = nsToDate(a.dueDate);
        const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
        return diff <= 1;
      }).length,
    [assignments],
  );

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div
      className="app-container flex flex-col"
      style={{
        height: "100dvh",
        overflow: "hidden",
        boxShadow: "0 0 0 1px oklch(0.88 0.012 85 / 0.5)",
      }}
    >
      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "subjects" && <SubjectsTab />}
        {activeTab === "timer" && <TimerTab />}
        {activeTab === "assignments" && <AssignmentsTab />}
      </div>

      {/* Bottom nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        assignmentBadge={pendingCount}
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Center app shell on desktop */}
      <div
        className="min-h-dvh"
        style={{
          background: "oklch(0.94 0.01 85)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {identity ? <AppShell /> : <LoginScreen />}
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
