import { Outlet } from 'react-router-dom';
import NavbarAuth from '../AppHeader';
import Appsidebar from '../ui/Appsidebar';
import { SidebarProvider } from "../ui/sidebar";

const AuthLayout = () => {
  return (
    <div className='flex'>
      <SidebarProvider defaultOpen={true} open={true}>
          <Appsidebar /> 
        <main className='w-full h-svh flex flex-col'>
          <NavbarAuth />
          <div className='px-8 py-8 flex-1 overflow-y-auto'>
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default AuthLayout;