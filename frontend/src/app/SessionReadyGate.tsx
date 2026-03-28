import { type ReactNode, useEffect, useState } from 'react';
import { useSessionStore } from '@/store/session.store';

/**
 * Avoids auth guard flicker before zustand persist rehydrates from storage.
 */
export function SessionReadyGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => useSessionStore.persist.hasHydrated());

  useEffect(() => {
    if (ready) return;
    const unsub = useSessionStore.persist.onFinishHydration(() => setReady(true));
    return unsub;
  }, [ready]);

  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fcf6f0] text-[#764d2f] text-sm">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
