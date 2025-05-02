import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './styles/Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">TaskHub</Link>
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/chat">Chat</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/Browse">Browse</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 