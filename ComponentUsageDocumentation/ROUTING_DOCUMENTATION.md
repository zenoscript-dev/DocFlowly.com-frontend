# Routing Documentation

This document explains how to add protected and unprotected routes to your React application using the current routing architecture.

## Table of Contents

1. [Overview](#overview)
2. [Route Types](#route-types)
3. [Adding Routes](#adding-routes)
4. [Route Protection](#route-protection)
5. [Layout Behavior](#layout-behavior)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

## Overview

The application uses a centralized routing system with the following components:

- **`src/core/config/routes.ts`**: Central route configuration
- **`src/core/appRouter/Router.tsx`**: React Router setup with lazy loading
- **`src/components/Route.tsx`**: Route protection wrapper
- **`src/hooks/useProtectedRoute.ts`**: Hook for route protection logic
- **`src/App.tsx`**: Main layout component

## Route Types

### 1. Public Routes (Unprotected)
- **Purpose**: Accessible to all users without authentication
- **Layout**: No sidebar, minimal layout
- **Examples**: Landing page, pricing, sign-in, register

### 2. Protected Routes
- **Purpose**: Require user authentication
- **Layout**: Full layout with sidebar and navbar
- **Examples**: Dashboard, user profile, admin pages

## Adding Routes

### Step 1: Update Route Configuration

Add your route to the `ROUTES` array in `src/core/config/routes.ts`:

```typescript
export const ROUTES: RouteConfig[] = [
  // Public routes (no sidebar)
  {
    path: '/',
    isProtected: false,
    title: 'Landing',
  },
  {
    path: '/pricing',
    isProtected: false,
    title: 'Pricing',
  },
  
  // Protected routes (with sidebar)
  {
    path: '/dashboard',
    isProtected: true,
    title: 'Dashboard',
  },
  {
    path: '/user',
    isProtected: true,
    title: 'User Profile',
  },
  
  // Add your new route here
  {
    path: '/your-new-route',
    isProtected: true, // or false for public routes
    title: 'Your Route Title',
  },
];
```

### Step 2: Create Your Component

Create your component file (e.g., `src/components/YourComponent.tsx`):

```typescript
import React from 'react';

const YourComponent = () => {
  return (
    <div>
      <h1>Your Component Content</h1>
      {/* Your component logic here */}
    </div>
  );
};

export default YourComponent;
```

### Step 3: Add Route to Router

Update `src/core/appRouter/Router.tsx` to include your new route:

```typescript
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../../App';
import Route from '../../components/Route';
import Spinner from '../../components/ui/Spinner';

// Lazy load your component
const YourComponent = lazy(() => import('../../components/YourComponent'));
const NotFoundPage = lazy(() => import('../../modules/error/NotFoundPage'));
const InternalServerError = lazy(() => import('../../modules/error/InternalServerError'));

const LoadingWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Spinner /></div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <LoadingWrapper>
        <InternalServerError />
      </LoadingWrapper>
    ),
    children: [
      {
        path: '/',
        element: (
          <LoadingWrapper>
            <Route>
              <h1>Landing Page</h1>
            </Route>
          </LoadingWrapper>
        ),
      },
      // Add your new route here
      {
        path: '/your-new-route',
        element: (
          <LoadingWrapper>
            <Route>
              <YourComponent />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <LoadingWrapper>
            <NotFoundPage />
          </LoadingWrapper>
        ),
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
```

## Route Protection

### How Protection Works

1. **Route Configuration**: The `isProtected` property in `routes.ts` determines if a route requires authentication
2. **Route Component**: The `Route` component checks authentication status and redirects if needed
3. **Auth Provider**: Manages authentication state and token
4. **Layout Logic**: Determines whether to show sidebar based on route protection

### Protection Flow

```typescript
// In Route.tsx
const shouldBeProtected = isProtected ?? isProtectedRoute(location.pathname);

useEffect(() => {
  if (shouldBeProtected && token === null) {
    navigate('/signin', { replace: true });
  }
}, [shouldBeProtected, navigate, token]);
```

### Manual Protection Override

You can override the automatic protection by passing the `isProtected` prop:

```typescript
<Route isProtected={true}>
  <YourComponent />
</Route>
```

## Layout Behavior

### Public Routes (isProtected: false)
- **Layout**: Minimal layout without sidebar
- **Components**: Only the route content is rendered
- **Navigation**: Basic navigation without sidebar menu

### Protected Routes (isProtected: true)
- **Layout**: Full layout with sidebar and navbar
- **Components**: Sidebar, navbar, and route content
- **Navigation**: Complete navigation with sidebar menu

### Layout Logic in App.tsx

```typescript
const App = () => {
  const { showSidebar } = useProtectedRoute();

  if (showSidebar) {
    return (
      <div className='flex'>
        <SidebarProvider> 
          <Appsidebar />
          <main className='w-full h-full'>
            <Navbar />
            <div className='px-8 py-8'>
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};
```

## Examples

### Example 1: Adding a Public Route

```typescript
// 1. Add to routes.ts
{
  path: '/about',
  isProtected: false,
  title: 'About Us',
},

// 2. Create component
const AboutPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold">About Us</h1>
    <p>This is a public page accessible to everyone.</p>
  </div>
);

// 3. Add to Router.tsx
const AboutPage = lazy(() => import('../../components/AboutPage'));

// In children array:
{
  path: '/about',
  element: (
    <LoadingWrapper>
      <Route>
        <AboutPage />
      </Route>
    </LoadingWrapper>
  ),
},
```

### Example 2: Adding a Protected Route

```typescript
// 1. Add to routes.ts
{
  path: '/settings',
  isProtected: true,
  title: 'Settings',
},

// 2. Create component
const SettingsPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold">Settings</h1>
    <p>This page requires authentication and shows the sidebar.</p>
  </div>
);

// 3. Add to Router.tsx
const SettingsPage = lazy(() => import('../../components/SettingsPage'));

// In children array:
{
  path: '/settings',
  element: (
    <LoadingWrapper>
      <Route>
        <SettingsPage />
      </Route>
    </LoadingWrapper>
  ),
},
```

### Example 3: Nested Routes

```typescript
// 1. Add parent and child routes to routes.ts
{
  path: '/admin',
  isProtected: true,
  title: 'Admin',
},
{
  path: '/admin/users',
  isProtected: true,
  title: 'User Management',
},

// 2. Add to Router.tsx with nested structure
{
  path: '/admin',
  element: (
    <LoadingWrapper>
      <Route>
        <AdminLayout />
      </Route>
    </LoadingWrapper>
  ),
  children: [
    {
      path: 'users',
      element: (
        <LoadingWrapper>
          <UserManagement />
        </LoadingWrapper>
      ),
    },
  ],
},
```

## Best Practices

### 1. Route Organization
- Group related routes together
- Use descriptive route titles
- Follow consistent naming conventions
- Keep route paths simple and RESTful

### 2. Component Structure
- Use lazy loading for all route components
- Wrap components with `LoadingWrapper` for consistent loading states
- Always wrap with `Route` component for protection
- Keep components focused and single-purpose

### 3. Authentication
- Always set `isProtected` correctly in route configuration
- Test both authenticated and unauthenticated states
- Handle loading states during authentication checks
- Provide clear feedback for unauthorized access

### 4. Performance
- Use lazy loading for all route components
- Implement proper error boundaries
- Optimize bundle splitting for large applications
- Monitor route transition performance

### 5. User Experience
- Provide clear navigation feedback
- Handle loading states gracefully
- Implement proper error pages
- Ensure consistent layout across route types

## Troubleshooting

### Common Issues

1. **Route not found**: Ensure route is added to both `routes.ts` and `Router.tsx`
2. **Infinite redirects**: Check authentication logic in `Route.tsx`
3. **Layout issues**: Verify `isProtected` setting matches expected layout
4. **Loading not showing**: Ensure `LoadingWrapper` is properly implemented

### Debug Tips

- Use browser dev tools to check route matching
- Verify authentication state in React DevTools
- Check console for lazy loading errors
- Test both authenticated and unauthenticated flows

## File Structure Reference

```
src/
├── core/
│   ├── config/
│   │   └── routes.ts          # Route configuration
│   └── appRouter/
│       └── Router.tsx         # React Router setup
├── components/
│   ├── Route.tsx              # Route protection wrapper
│   └── AuthProvider.tsx       # Authentication context
├── hooks/
│   └── useProtectedRoute.ts   # Route protection hook
└── App.tsx                    # Main layout component
```

This documentation provides a complete guide for adding both protected and unprotected routes to your application while maintaining the existing architecture and best practices. 