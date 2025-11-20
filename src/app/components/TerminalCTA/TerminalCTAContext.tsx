'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

interface TerminalCTAContextValue {
  shouldRender: boolean;
  setShouldRender: (value: boolean) => void;
}

const TerminalCTAContext = createContext<TerminalCTAContextValue | undefined>(
  undefined,
);

export const useTerminalCTAContext = () => {
  const context = useContext(TerminalCTAContext);
  if (!context) {
    throw new Error(
      'useTerminalCTAContext must be used within TerminalCTAProvider',
    );
  }
  return context;
};

export const TerminalCTAProvider = ({ children }: { children: ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(true);

  const value = useMemo(
    () => ({
      shouldRender,
      setShouldRender,
    }),
    [shouldRender],
  );

  return (
    <TerminalCTAContext.Provider value={value}>
      {children}
    </TerminalCTAContext.Provider>
  );
};

