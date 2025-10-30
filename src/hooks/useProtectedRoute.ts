import { getRouteConfig, isProtectedRoute, shouldShowSidebar } from '@/core/config/routes';
import { useLocation } from 'react-router-dom';

export const useProtectedRoute = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const routeConfig = getRouteConfig(currentPath);
  const isProtected = isProtectedRoute(currentPath);
  const showSidebar = shouldShowSidebar(currentPath);

  return {
    isProtected,
    showSidebar,
    currentPath,
    routeConfig,
  };
}; 