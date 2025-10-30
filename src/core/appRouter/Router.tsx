import ClientDetails from '@/modules/Clients/ClientDetails';
import Clients from '@/modules/Clients/Clients';
import EditClient from '@/modules/Clients/EditClient';
import NewClient from '@/modules/Clients/NewClient';
import UnAuthorizedPage from '@/modules/error/UnAuthorizedPage.tsx';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../../App';
import Route from '../../components/Route';
import Spinner from '../../components/ui/Spinner';
const PdfEditor = lazy(() => import('@/modules/PdfEditor/PdfEditor.tsx'));
const Templates = lazy(() => import('@/modules/Templates/Templates.tsx'));
const Signin = lazy(() => import('@/modules/auth/Signin.tsx'));
const Signup = lazy(() => import('@/modules/auth/Signup.tsx'));
const LandingPage = lazy(() => import('@/modules/LandingPage/LandingPage.tsx'));
const NotFoundPage = lazy(() => import('../../modules/error/NotFoundPage'));
const InternalServerError = lazy(() => import('../../modules/error/InternalServerError'));
const ForbiddenPage = lazy(() => import('../../modules/error/ForbiddenPage'))

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
            <Route isProtected={false}>
              <LandingPage />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/signin',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <Signin />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/signup', 
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <Signup />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/forbidden',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <ForbiddenPage />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/unauthorized',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <UnAuthorizedPage />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/spinner',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <Spinner />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/not-found',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <NotFoundPage />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/templates',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <Templates />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/clients',
        element: (
          <LoadingWrapper>
            <Route isProtected={true}>
              <Clients />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/clients/new',
        element: (
          <LoadingWrapper>
            <Route isProtected={true}>
              <NewClient />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/clients/:id',
        element: (
          <LoadingWrapper>
            <Route isProtected={true}>
              <ClientDetails />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/clients/:id/edit',
        element: (
          <LoadingWrapper>
            <Route isProtected={true}>
              <EditClient />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '/pdf-editor',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <PdfEditor />
            </Route>
          </LoadingWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <LoadingWrapper>
            <Route isProtected={false}>
              <NotFoundPage />
            </Route>
          </LoadingWrapper>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
