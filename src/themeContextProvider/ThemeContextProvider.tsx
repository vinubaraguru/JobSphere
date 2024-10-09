import React, { createContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#616161' },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0bec5' },
  },
});

interface ThemeContextType {
  toggleTheme: () => void;
  themeMode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined | any>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = React.useContext(ThemeContext);
  return context;
};
