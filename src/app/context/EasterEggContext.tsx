'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';

interface EasterEggState {
  konamiCodeActivated: boolean;
  matrixRainActive: boolean;
  discoModeActive: boolean;
  typewriterModeActive: boolean;
  devConsoleActive: boolean;
}

interface EasterEggContextType {
  easterEggState: EasterEggState;
  activateKonamiCode: () => void;
  toggleMatrixRain: () => void;
  toggleDiscoMode: () => void;
  toggleTypewriterMode: () => void;
  toggleDevConsole: () => void;
  resetAllEasterEggs: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(
  undefined
);

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

export const EasterEggProvider = ({ children }: { children: ReactNode }) => {
  const [easterEggState, setEasterEggState] = useState<EasterEggState>({
    konamiCodeActivated: false,
    matrixRainActive: false,
    discoModeActive: false,
    typewriterModeActive: false,
    devConsoleActive: false,
  });

  const konamiSequenceRef = useRef<string[]>([]);

  const toggleMatrixRain = useCallback(() => {
    setEasterEggState((prev) => ({
      ...prev,
      matrixRainActive: !prev.matrixRainActive,
    }));
  }, []);

  const activateKonamiCode = useCallback(() => {
    setEasterEggState((prev) => ({
      ...prev,
      konamiCodeActivated: true,
    }));

    // Auto-activate matrix rain when Konami code is entered
    setTimeout(() => {
      toggleMatrixRain();
    }, 500);
  }, [toggleMatrixRain]);

  // Konami code detector
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Konami code sequence
      const newSequence = [...konamiSequenceRef.current, event.code];

      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift();
      }

      konamiSequenceRef.current = newSequence;

      // Check if Konami code is complete
      if (newSequence.length === KONAMI_CODE.length) {
        const isKonamiCode = newSequence.every(
          (key, index) => key === KONAMI_CODE[index]
        );
        if (isKonamiCode) {
          activateKonamiCode();
          konamiSequenceRef.current = [];
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activateKonamiCode]);

  const toggleDiscoMode = () => {
    setEasterEggState((prev) => ({
      ...prev,
      discoModeActive: !prev.discoModeActive,
    }));
  };

  const toggleTypewriterMode = () => {
    setEasterEggState((prev) => ({
      ...prev,
      typewriterModeActive: !prev.typewriterModeActive,
    }));
  };

  const toggleDevConsole = () => {
    setEasterEggState((prev) => ({
      ...prev,
      devConsoleActive: !prev.devConsoleActive,
    }));
  };

  const resetAllEasterEggs = () => {
    setEasterEggState({
      konamiCodeActivated: false,
      matrixRainActive: false,
      discoModeActive: false,
      typewriterModeActive: false,
      devConsoleActive: false,
    });
  };

  return (
    <EasterEggContext.Provider
      value={{
        easterEggState,
        activateKonamiCode,
        toggleMatrixRain,
        toggleDiscoMode,
        toggleTypewriterMode,
        toggleDevConsole,
        resetAllEasterEggs,
      }}
    >
      {children}
    </EasterEggContext.Provider>
  );
};

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (context === undefined) {
    throw new Error('useEasterEgg must be used within an EasterEggProvider');
  }
  return context;
};
