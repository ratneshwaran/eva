'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'blue' | 'purple' | 'green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'blue',
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('blue');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored === 'blue' || stored === 'purple' || stored === 'green') {
      setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-green');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
