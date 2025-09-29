import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Header = ( {title} ) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className='shadow-sm border-b' style={{ backgroundColor: "rgb(var(--card))", borderColor: "rgb(var(--border))" }}>
        <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
            <h1 className='text-2xl font-semibold' style={{ color: "rgb(var(--text))" }}>{title}</h1>
            <button
              onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
              className="btn"
              aria-label="Toggle theme"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-sm">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
        </div>
    </header>
  )
}

export default Header