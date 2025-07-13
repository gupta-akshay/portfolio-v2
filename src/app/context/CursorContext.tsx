'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CursorContextType {
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
  cursorText: string;
  setCursorText: (text: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');

  return (
    <CursorContext.Provider
      value={{
        cursorVariant,
        setCursorVariant,
        cursorText,
        setCursorText,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
