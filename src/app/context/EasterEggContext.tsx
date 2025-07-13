'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface EasterEggState {
  konamiCodeActivated: boolean;
  matrixRainActive: boolean;
  discoModeActive: boolean;
  typewriterModeActive: boolean;
  devConsoleActive: boolean;
  particleTrailActive: boolean;
}

interface EasterEggContextType {
  easterEggState: EasterEggState;
  activateKonamiCode: () => void;
  toggleMatrixRain: () => void;
  toggleDiscoMode: () => void;
  toggleTypewriterMode: () => void;
  toggleDevConsole: () => void;
  toggleParticleTrail: () => void;
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
    particleTrailActive: false,
  });

  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [spacebarPressed, setSpacebarPressed] = useState(false);

  // Konami code detector
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle spacebar for particle trail
      if (event.code === 'Space') {
        setSpacebarPressed(true);
        toggleParticleTrail();
        return;
      }

      // Handle Konami code sequence
      const newSequence = [...konamiSequence, event.code];

      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift();
      }

      setKonamiSequence(newSequence);

      // Check if Konami code is complete
      if (newSequence.length === KONAMI_CODE.length) {
        const isKonamiCode = newSequence.every(
          (key, index) => key === KONAMI_CODE[index]
        );
        if (isKonamiCode) {
          activateKonamiCode();
          setKonamiSequence([]);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setSpacebarPressed(false);
        if (easterEggState.particleTrailActive) {
          toggleParticleTrail();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [konamiSequence, easterEggState.particleTrailActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup all Easter egg states on unmount
  useEffect(() => {
    return () => {
      // Reset all Easter egg states to prevent memory leaks
      setEasterEggState({
        konamiCodeActivated: false,
        matrixRainActive: false,
        discoModeActive: false,
        typewriterModeActive: false,
        devConsoleActive: false,
        particleTrailActive: false,
      });
    };
  }, []);

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

  const toggleParticleTrail = () => {
    setEasterEggState((prev) => ({
      ...prev,
      particleTrailActive: !prev.particleTrailActive,
    }));
  };

  const resetAllEasterEggs = () => {
    setEasterEggState({
      konamiCodeActivated: false,
      matrixRainActive: false,
      discoModeActive: false,
      typewriterModeActive: false,
      devConsoleActive: false,
      particleTrailActive: false,
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
        toggleParticleTrail,
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
