import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import './styles/Auth.css';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // If user is already logged in, redirect to chat
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
  
    try {
      setError('');
      setLoading(true);
  
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

        const data = await response.json();

      // console.log(textResponse);  // 🧪 Debug output
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/chat');
      } else {
        // console.log(data); // 🧪 Debug output
        setError(data.errors ? data.errors.map(err => err.msg).join(', ') : data.message || 'Failed to register');
      }
    } catch (error) {
      setError('Failed to create an account');
      console.error('Registration error:', error);
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register with your details</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
              />
            </div>

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
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <Link to="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
        
        <div className="auth-welcome">
          <h2>Welcome Back!</h2>
          <p>To keep connected with us please login with your personal info</p>
          <Link to="/login" className="auth-button">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 