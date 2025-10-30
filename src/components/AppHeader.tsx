import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useCustomMutation } from '@/hooks/useTanstackQuery'
import { useToast } from '@/hooks/useToast'
import { authKeys, authService } from '@/services/auth/authService'
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Badge, Bell, Globe, Loader2, LogOut, Moon, RotateCcwKey, Settings, Sun, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { useTheme } from "./ThemeProvider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar"

interface NavigationLink {
  title: string;
  description: string;
  path: string;
}

const AppHeader = () => {
  const navigate = useNavigate()
  const { setTheme } = useTheme();
  const { setToken } = useAuth();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigationLinks: NavigationLink[] = [
    {
      title: "Components",
      description: "Browse all components in the library.",
      path: "/"
    },
    {
      title: "Documentation",
      description: "Learn how to use the library.",
      path: "/"
    },
    {
      title: "Blog",
      description: "Read our latest blog posts.",
      path: "/"
    }
  ];

  // Logout mutation with comprehensive error handling
  const logoutMutation = useCustomMutation<void, void>(
    async () => {
      await authService.signout();
    },
    {
      mutationKey: [authKeys.LOGOUT],
      onSuccess: () => {
        // Clear token from auth context
        setToken(null);
        
        // Show success toast
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
          variant: "default",
        });
        
        // Navigate to signin page
        navigate('/signin');
      },
      onError: (error) => {
        console.error('Logout error:', error);
        
        // Even if logout API fails, we should still clear local data
        setToken(null);
        
        // Show error toast
        toast({
          title: "Logout completed",
          description: "You have been logged out locally.",
          variant: "default",
        });
        
        // Navigate to signin page
        navigate('/signin');
      },
      retry: false, // Don't retry logout
    }
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Error is already handled in onError callback
      console.error('Logout submission error:', error);
    }
  };

  return (
    <nav className='p-4 flex h-16 items-center justify-between pr-[80px] bg-primary-foreground sticky top-0 left-0 right-0 z-50'>
      {/* left  */}
      <div className='flex items-center gap-8'>
        <SidebarTrigger />
        <span className='text-custom-color'>Welcome back {user?.firstName || ''} {user?.lastName || ''}</span>
      </div>
      {/* right */}
      <div className='flex items-center gap-8'>
        <NavigationMenu viewport={false} >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger><Bell className='text-custom-color' />
              <Badge
                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              >
                20+
              </Badge></NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-4">
                  <li>
                    {navigationLinks.map((link: NavigationLink, index: number) => (
                      <NavigationMenuLink key={index} asChild>
                        <Link to={link.path}>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-muted-foreground">
                            {link.description}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    ))}

                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger><Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar></DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User />Profile</DropdownMenuItem>
            <DropdownMenuItem><RotateCcwKey />Change Password</DropdownMenuItem>
            <DropdownMenuItem><Globe />Change County</DropdownMenuItem>
            <DropdownMenuItem><Settings />Settings</DropdownMenuItem>
            <DropdownMenuItem 
              variant='destructive' 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  )
}

export default AppHeader
