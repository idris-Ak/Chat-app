import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes/routes';
import RouteTitleUpdater from './components/RouteTitleUpdater';


function App() {
  return (
    <>
      <Router>
        <RouteTitleUpdater />
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
