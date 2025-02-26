import React from 'react';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: '#5c4033',
      secondary: '#8B4513',
      background: '#F4E1D2',
      text: '#40322E',
      accent: '#A67B5B',
    },
    spacing: {
      section: '2.5rem',
      content: '1.5rem',
      element: '1rem',
    },
    transitions: {
      default: 'all 300ms ease-in-out',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
