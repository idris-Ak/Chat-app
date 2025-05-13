import Login from '../pages/Login';
import Register from '../pages/Register';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Landing from '../pages/Landing';
import Browse from '../pages/Browse';
import HowItWorks from '../pages/HowItWorks';
import Contact from '../pages/Contact';
import LandingPage from '../pages/LandingPage';
import PrivateRoute from '../components/PrivateRoute';
import FlexibleRouteHandler from '../pages/FlexibleRouteHandler'; // Import the new component

const routes = [
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/profile', element: <Profile /> },
  { path: '/browse', element: <Browse /> },
  { path: '/LandingPage', element: <LandingPage /> },
  { path: '/how-it-works', element: <HowItWorks /> },
  { path: '/contact', element: <Contact /> },
  {
    path: '/chat',
    element: (
      <PrivateRoute>
        <Chat />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <FlexibleRouteHandler />
  },
];

export default routes;
