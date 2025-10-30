import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
// import { seedLocalDatabase } from '@/api/data/seed';
import AuthProvider from '@/components/AuthProvider';
import { ThemeProvider } from "./components/ThemeProvider";
import Router from './core/appRouter/Router';
import { store } from './core/state/store';
// import { globalErrorHandler } from './utils/globalErrorHandler';

const queryClient = new QueryClient();

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import "./index.css";
// DO NOT REMOVE: Seeds the local storage database with data
// seedLocalDatabase();

// Initialize global error handler
// globalErrorHandler.initialize();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Provider store={store}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </Provider>
      </ThemeProvider>
      {import.meta.env.VITE_ENVIRONMENT === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
);
