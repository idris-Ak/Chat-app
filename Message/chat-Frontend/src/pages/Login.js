import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import './styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to chat
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // The AuthContext will handle the navigation after proper session verification
        // No need to navigate here as the first useEffect will handle it
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to login');
      console.error('Login error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <Navigation />
      </header>
      <div className="auth-card">
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please sign in to continue</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <Link to="/register" className="auth-link">
            Don't have an account? Sign up
          </Link>
        </div>
        
        <div className="auth-welcome">
          <h2>Hello, Friend!</h2>
          <p>Enter your personal details and start your journey with us</p>
          <Link to="/register" className="auth-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 