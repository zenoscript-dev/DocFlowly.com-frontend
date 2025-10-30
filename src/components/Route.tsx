import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import { isProtectedRoute } from '@/core/config/routes';
import { useAuth } from './AuthProvider';

const Route = ({ children, isProtected }: { children: React.ReactNode; isProtected?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  // If isProtected is not explicitly passed, determine from route configuration
  const shouldBeProtected = isProtected ?? isProtectedRoute(location.pathname);

  useEffect(() => {
    if (shouldBeProtected && token === null) {
      navigate('/signin', { replace: true });
    }
  }, [shouldBeProtected, navigate, token]);

  // if (token === undefined) {
  //   return (
  //     <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center'>
  //       <Spinner />
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default Route;
