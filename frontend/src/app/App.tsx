import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { queryClient } from './query-client';
import { SessionReadyGate } from './SessionReadyGate';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionReadyGate>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </SessionReadyGate>
    </QueryClientProvider>
  );
}
