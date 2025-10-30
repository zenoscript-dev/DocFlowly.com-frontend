
// Route configuration with protection status
export interface RouteConfig {
  path: string;
  isProtected: boolean;
  title?: string;
}

export const ROUTES: RouteConfig[] = [
  // Public routes (no sidebar)
  {
    path: '/',
    isProtected: false,
    title: 'Landing',
  },
  {
    path: '/register',
    isProtected: false,
    title: 'Register',
  },
  {
    path: '/signin',
    isProtected: false,
    title: 'Sign In',
  },
  {
    path: '/templates',
    isProtected: false,
    title: 'Templates',
  },
  {
    path: '/pdf-editor',
    isProtected: false,
    title: 'PDF Editor',
  },
  {
    path: '/clients',
    isProtected: true,
    title: 'Clients',
  },
  {
    path: '/clients/new',
    isProtected: true,
    title: 'New Client',
  },
  {
    path: '/clients/:id',
    isProtected: true,
    title: 'Client Details',
  },
  {
    path: '/clients/:id/edit',
    isProtected: true,
    title: 'Edit Client',
  },
  // Protected routes (with sidebar)
  {
    path: '/dashboard',
    isProtected: true,
    title: 'Dashboard',
  },
  {
    path: '/not-found',
    isProtected: false,
    title: 'Not Found',
  },
];

// Helper funct
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  // First, check for an exact match.
  const exactMatch = ROUTES.find(route => route.path === path);
  if (exactMatch) {
    return exactMatch;
  }
 
  // If no exact match, check for dynamic routes.
  // A dynamic route path would be like '/demo/:id'
  // The provided 'path' would be like '/demo/1'
  const pathSegments = path.split('/'); 
  return ROUTES.find(route => {
    const routeSegments = route.path.split('/');
    if (routeSegments.length !== pathSegments.length) {
      return false; 
    }
 
    // Check if the route is a dynamic one
    return routeSegments.every((segment, index) => {
      // If the segment is a parameter (starts with ':') or an exact match, it's a valid part of the route.
      return segment.startsWith(':') || segment === pathSegments[index];
    });
  });
};
export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteConfig(path);
  return route?.isProtected ?? false;
};

export const shouldShowSidebar = (path: string): boolean => {
  const route = getRouteConfig(path);
  return route?.isProtected ?? false;
}; 