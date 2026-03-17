import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  BarChart2,
  BookOpen,
  CheckSquare,
  Clock,
  Loader2,
  LogIn,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Study Timer",
    desc: "Track time per subject",
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    label: "Assignments",
    desc: "Never miss a deadline",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    label: "Weekly Stats",
    desc: "Visualize your progress",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: "Subjects",
    desc: "Organize by subject",
  },
];

export function LoginScreen() {
  const { login, isLoggingIn, isLoginError } = useInternetIdentity();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between bg-background px-6 py-10">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo */}
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-[0_8px_32px_oklch(0.56_0.22_264/0.35)]">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">StudyTrack</h1>
            <p className="text-muted-foreground mt-1.5 text-base leading-relaxed">
              Your personal study companion.
              <br />
              Track time, manage assignments, and ace your goals.
            </p>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 gap-3 w-full"
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="card-elevated rounded-2xl p-4 text-left"
              style={{ animationDelay: `${i * 0.05 + 0.2}s` }}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                {f.icon}
              </div>
              <p className="text-sm font-semibold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {isLoginError && (
          <p className="text-sm text-destructive text-center">
            Login failed. Please try again.
          </p>
        )}
        <Button
          size="lg"
          className="w-full h-14 text-base rounded-2xl gap-2.5 shadow-[0_4px_20px_oklch(0.56_0.22_264/0.35)]"
          onClick={login}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {isLoggingIn ? "Signing in…" : "Sign in to StudyTrack"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Your study data is private and stored securely on-chain.
        </p>
        <p className="text-xs text-center text-muted-foreground/60 mt-1">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
