import { Outlet } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useEffect } from 'react';
import AppHeader from './components/AppHeader';
import Appsidebar from './components/ui/Appsidebar';
import { SidebarProvider } from './components/ui/sidebar';

const App = () => {
  const { showSidebar } = useProtectedRoute();
  // set document title
  useEffect(() => {
    document.title = import.meta.env.VITE_APPLICATION_NAME;
  }, []);

  // If the route should show sidebar, render the full layout with sidebar and navbar
  if (showSidebar) {
    return (
      <div className='w-full min-h-svh flex'>
        <SidebarProvider defaultOpen={true} open={true}> 
          <Appsidebar />
          <main className='w-full h-svh flex flex-col'>
            <AppHeader />
            <div className='px-8 py-8 flex-1 overflow-y-auto'>
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
        <Toaster />
      </div>
    );
  }

  // Otherwise, render just the Outlet (for public routes without sidebar)
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
