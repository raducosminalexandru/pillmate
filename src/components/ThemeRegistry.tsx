'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  setMode: (mode: 'light' | 'dark') => {},
  mode: 'light',
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
      setMode(savedMode);
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }, []);

  
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', (mode === 'dark').toString());
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [mode]);

  
  const colorMode = {
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
    setMode: (newMode: 'light' | 'dark') => {
      setMode(newMode);
    },
    mode,
  };

  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                
                primary: {
                  main: '#2196f3',
                },
                secondary: {
                  main: '#f50057',
                },
              }
            : {
                
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
