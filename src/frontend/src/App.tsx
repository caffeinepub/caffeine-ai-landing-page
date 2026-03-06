import { useEffect } from "react";
import { CaffeineFAQ } from "./components/CaffeineFAQ";
import { CaffeineFeatures } from "./components/CaffeineFeatures";
import { CaffeineFinalCTA } from "./components/CaffeineFinalCTA";
import { CaffeineFooter } from "./components/CaffeineFooter";
import { CaffeineHero } from "./components/CaffeineHero";
import { CaffeineHowItWorks } from "./components/CaffeineHowItWorks";
import { CaffeineNavbar } from "./components/CaffeineNavbar";
import { CaffeineStats } from "./components/CaffeineStats";
import { CaffeineTechnology } from "./components/CaffeineTechnology";
import { CaffeineUseCases } from "./components/CaffeineUseCases";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CaffeineNavbar />
      <main>
        <CaffeineHero />
        <CaffeineStats />
        <CaffeineHowItWorks />
        <CaffeineFeatures />
        <CaffeineUseCases />
        <CaffeineTechnology />
        <CaffeineFAQ />
        <CaffeineFinalCTA />
      </main>
      <CaffeineFooter />
    </div>
  );
}

export default App;
