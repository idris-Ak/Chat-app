import { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      return setError('Passwords do not  match');
    }
  
    try {
      setError('');
      setLoading(true);
  
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      const textResponse = await response.json();  // Get raw response text

      console.log(textResponse);  // Log the raw response text
      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        console.log(data); // Check the content of the response
        setError(data.message || 'Failed to register');
      }
    } catch (error) {
      setError('Failed to create an account');
      console.error('Registration error:', error);
    }
  
    setLoading(false);
  };
  
  return (
    <div className="register-container">
      <div className="register-box">
        <div>
          <h2 className="register-title">Sign up</h2>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm-password" className="input-label">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="link">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 