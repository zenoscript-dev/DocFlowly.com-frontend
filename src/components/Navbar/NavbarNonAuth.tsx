import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FileText, Menu, Monitor, Moon, Sun } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

const NavbarNonAuth: React.FC<NavigationProps> = ({ scrollToSection }) => {
  const { setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = React.useState(false);
  const [isMobileThemeDropdownOpen, setIsMobileThemeDropdownOpen] = React.useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileThemeDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Features', id: 'features' },
    { name: 'Templates', id: 'templates' },
    { name: 'Pricing', id: 'pricing' },
  ];

  // Handle scroll to close dropdowns
  useEffect(() => {
    const handleScroll = () => {
      if (isThemeDropdownOpen) {
        setIsThemeDropdownOpen(false);
      }
      if (isMobileThemeDropdownOpen) {
        setIsMobileThemeDropdownOpen(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isThemeDropdownOpen, isMobileThemeDropdownOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (mobileThemeDropdownRef.current && !mobileThemeDropdownRef.current.contains(event.target as Node)) {
        setIsMobileThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8'>
        {/* Logo */}
        <a className='flex items-center space-x-2' href='/'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 sm:h-10 sm:w-10'>
            <FileText className='w-5 h-5 text-white' />
          </div>
          <span className='text-foreground text-xl font-bold sm:text-2xl'>
            {import.meta.env.VITE_APPLICATION_NAME || 'TSMS'}
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className='hidden items-center space-x-6 md:flex lg:space-x-8'>
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant='ghost'
              onClick={() => scrollToSection(item.id)}
              className='text-foreground h-auto cursor-pointer px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 sm:text-base'
            >
              {item.name}
            </Button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className='hidden items-center space-x-2 md:flex'>
          {/* Theme Switcher */}
          <div ref={themeDropdownRef}>
            <DropdownMenu 
              open={isThemeDropdownOpen} 
              onOpenChange={setIsThemeDropdownOpen}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 cursor-pointer'
                >
                  <Sun className='h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0' />
                  <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100' />
                  <span className='sr-only'>Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align='end' 
                className='w-36 z-[60]'
                sideOffset={8}
                alignOffset={-8}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={() => setIsThemeDropdownOpen(false)}
                onPointerDownOutside={() => setIsThemeDropdownOpen(false)}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('light');
                    setIsThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Sun className='mr-2 h-4 w-4' />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('dark');
                    setIsThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Moon className='mr-2 h-4 w-4' />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('system');
                    setIsThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Monitor className='mr-2 h-4 w-4' />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Templates Button */}
          {/* <Link to="/templates">
            <Button
              variant="outline"
              className='cursor-pointer mr-2'
            >
              Templates
            </Button>
          </Link> */}

          {/* CTA Button */}
          <Button
            onClick={() => window.location.href = '/templates'}
            className='cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-shadow duration-300 hover:shadow-lg hover:shadow-purple-500/25 sm:px-6'
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className='flex items-center space-x-2 md:hidden'>
          {/* Mobile Theme Switcher */}
          <div ref={mobileThemeDropdownRef}>
            <DropdownMenu 
              open={isMobileThemeDropdownOpen} 
              onOpenChange={setIsMobileThemeDropdownOpen}
              modal={false}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-9 w-9 cursor-pointer'
                >
                  <Sun className='h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0' />
                  <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100' />
                  <span className='sr-only'>Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align='end' 
                className='w-36 z-[60]'
                sideOffset={8}
                alignOffset={-8}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={() => setIsMobileThemeDropdownOpen(false)}
                onPointerDownOutside={() => setIsMobileThemeDropdownOpen(false)}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('light');
                    setIsMobileThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Sun className='mr-2 h-4 w-4' />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('dark');
                    setIsMobileThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Moon className='mr-2 h-4 w-4' />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme('system');
                    setIsMobileThemeDropdownOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <Monitor className='mr-2 h-4 w-4' />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 cursor-pointer'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <div className='flex flex-col space-y-4'>
                <div className='flex items-center space-x-2 px-2 py-4'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600'>
                    <span className='text-sm font-bold text-white'>T</span>
                  </div>
                  <span className='text-foreground text-lg font-bold'>
                    {import.meta.env.VITE_APPLICATION_NAME || 'TSMS'}
                  </span>
                </div>
                
                <div className='flex flex-col space-y-2'>
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant='ghost'
                      onClick={() => {
                        scrollToSection(item.id);
                        // Close sheet after navigation
                        const sheetTrigger = document.querySelector('[data-state="open"]');
                        if (sheetTrigger) {
                          (sheetTrigger as HTMLElement).click();
                        }
                      }}
                      className='text-foreground h-auto cursor-pointer justify-start px-3 py-3 text-left text-base font-medium transition-colors duration-200 hover:bg-muted hover:text-blue-600 dark:hover:text-blue-400'
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>

                {/* Templates Link */}
                  <Link to="/templates" className="block">
                <div className='pt-4 border-t'>
                    <Button
                      variant="outline"
                      className='w-full cursor-pointer justify-start text-left'
                    >
                      Templatesgdfgdfg
                    </Button>
                </div>
                  </Link>

                <div className='pt-4'>
                  <Button
                    onClick={() => {
                      window.location.href = '/templates';
                    }}
                    className='w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-base font-medium text-white transition-shadow duration-300 hover:shadow-lg hover:shadow-purple-500/25'
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNonAuth;
