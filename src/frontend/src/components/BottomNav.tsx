import { BookOpen, ClipboardList, LayoutDashboard, Timer } from "lucide-react";

type Tab = "dashboard" | "subjects" | "timer" | "assignments";

const TABS = [
  {
    id: "dashboard" as Tab,
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.tab",
  },
  {
    id: "subjects" as Tab,
    label: "Subjects",
    icon: BookOpen,
    ocid: "nav.subjects.tab",
  },
  { id: "timer" as Tab, label: "Timer", icon: Timer, ocid: "nav.timer.tab" },
  {
    id: "assignments" as Tab,
    label: "Tasks",
    icon: ClipboardList,
    ocid: "nav.assignments.tab",
  },
];

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  assignmentBadge?: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  assignmentBadge,
}: BottomNavProps) {
  return (
    <nav
      className="bottom-nav flex items-center justify-around px-2 pt-2 pb-safe"
      style={{
        height: "64px",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {TABS.map(({ id, label, icon: Icon, ocid }) => {
        const isActive = activeTab === id;
        const showBadge =
          id === "assignments" && assignmentBadge && assignmentBadge > 0;

        return (
          <button
            key={id}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 touch-target rounded-xl transition-all duration-200 relative ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
            type="button"
            onClick={() => onTabChange(id)}
            data-ocid={ocid}
            aria-label={label}
          >
            {/* Active indicator pill */}
            {isActive && (
              <div
                className="absolute top-0.5 w-6 h-1 rounded-full bg-primary"
                style={{
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            )}

            <div className="relative">
              <Icon
                className={`transition-all duration-200 ${
                  isActive ? "w-5 h-5" : "w-5 h-5"
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {showBadge && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                  <span className="text-[9px] font-bold text-destructive-foreground">
                    {assignmentBadge! > 9 ? "9+" : assignmentBadge}
                  </span>
                </div>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold leading-none transition-all duration-200 ${
                isActive ? "opacity-100" : "opacity-70"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export type { Tab };
