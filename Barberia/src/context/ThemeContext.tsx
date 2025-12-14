import React, { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  resetTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    primary: string;
  };
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 👉 TEMA OSCURO POR DEFECTO
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 👉 SE USA AL CERRAR SESIÓN
  const resetTheme = () => {
    setTheme("dark");
  };

  const colors =
    theme === "dark"
      ? {
          background: "#111827",
          card: "#1f2937",
          text: "#f9fafb",
          secondaryText: "#9ca3af",
          primary: "#7c3aed",
        }
      : {
          background: "#f4f4f5",
          card: "#ffffff",
          text: "#111827",
          secondaryText: "#6b7280",
          primary: "#7c3aed",
        };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, resetTheme, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return ctx;
};
