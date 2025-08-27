// ThemeContext.js
import React from 'react';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: '#3A2E2E',           // Deep Espresso Brown
      secondary: '#D4A373',         // Warm Gold-Beige
      background: '#F8F5F2',        // Cream White
      backgroundSecondary: '#EADBC8', // Soft Nude
      text: '#3A2E2E',             // Deep Espresso Brown
      textSecondary: '#3A2E2E80',   // 50% opacity brown
      textTertiary: '#3A2E2E60',    // 40% opacity brown
      accent: '#D4A373',           // Warm Gold-Beige
      white: '#FFFFFF',
      overlay: '#3A2E2E80',        // Brown with opacity for overlays
    },
    gradients: {
      primary: 'bg-gradient-to-br from-[#F8F5F2] to-[#EADBC8]',
      secondary: 'bg-gradient-to-br from-[#EADBC8] to-[#D4A373]',
      hero: 'bg-gradient-to-br from-[#F8F5F2] via-[#EADBC8] to-[#D4A373]',
      overlay: 'bg-gradient-to-t from-[#3A2E2E]/20 via-transparent to-transparent',
      accent: 'bg-gradient-to-r from-[#D4A373] to-[#EADBC8]',
    },
    spacing: {
      section: '4rem',      // 64px - Increased for premium feel
      sectionMobile: '3rem', // 48px - Mobile section spacing
      content: '2rem',      // 32px - Increased content spacing
      contentMobile: '1.5rem', // 24px - Mobile content spacing
      element: '1.5rem',    // 24px - Increased element spacing
      elementSmall: '1rem', // 16px - Small element spacing
    },
    transitions: {
      default: 'all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      slow: 'all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fast: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      spring: 'all 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    shadows: {
      soft: 'shadow-lg',
      medium: 'shadow-xl',
      hard: 'shadow-2xl',
      premium: 'shadow-2xl hover:shadow-3xl',
      glow: 'shadow-lg hover:shadow-xl hover:shadow-[#3A2E2E]/30',
    },
    borders: {
      light: 'border border-white/30',
      medium: 'border border-[#D4A373]/20',
      dark: 'border border-[#3A2E2E]/20',
    },
    animations: {
      fadeIn: 'animate-in fade-in duration-700',
      slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
      scaleIn: 'animate-in zoom-in-95 duration-300',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
