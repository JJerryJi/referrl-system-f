import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/ApplicationPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import DetailedJobPostPage from './pages/DetailedJobPostPage';
import SignupPage from './pages/SignupPage';
import SubmitApplicationPage from './pages/SubmitApplicationPage'
import EditApplicationPage from './pages/EditApplicationPage';
import NewJobPage from './pages/NewJobPage'
import ProfilePage from './pages/ProfilePage';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/job-posts" />, index: true },
        { path: 'job-posts', element: <DashboardAppPage /> },
        { path: 'job-posts/:jobId', element: <DetailedJobPostPage />},
        { path: 'application/:jobId', element: <SubmitApplicationPage />},
        { path: 'edit-application/:applicationId', element: <EditApplicationPage />},
        { path: 'new-job-posts', element: <NewJobPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'application', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignupPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" />,
    },
  ]);

  return routes;
}
