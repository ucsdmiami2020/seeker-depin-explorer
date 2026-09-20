import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Drives the first-run tour and the help sheet.
 *
 * `tourPending` starts true on every cold start, so the tour is shown once per launch and then
 * stays out of the way. It is deliberately kept in memory rather than on disk: the privacy policy
 * states the app stores nothing on the device, and a "seen the tour" flag would break that claim.
 */
interface HelpState {
  tourOpen: boolean;
  helpOpen: boolean;
  /** Called when the tabs mount; opens the tour the first time in a session. */
  startTourIfFirstRun: () => void;
  openTour: () => void;
  closeTour: () => void;
  openHelp: () => void;
  closeHelp: () => void;
}

const Ctx = createContext<HelpState | null>(null);

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [tourOpen, setTourOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tourPending, setTourPending] = useState(true);

  const startTourIfFirstRun = useCallback(() => {
    setTourPending((pending) => {
      if (pending) setTourOpen(true);
      return false;
    });
  }, []);

  const openTour = useCallback(() => {
    setHelpOpen(false);
    setTourOpen(true);
  }, []);

  const closeTour = useCallback(() => setTourOpen(false), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  const value = useMemo<HelpState>(
    () => ({ tourOpen, helpOpen, startTourIfFirstRun, openTour, closeTour, openHelp, closeHelp }),
    [tourOpen, helpOpen, startTourIfFirstRun, openTour, closeTour, openHelp, closeHelp],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHelp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useHelp must be used inside HelpProvider');
  return v;
}
