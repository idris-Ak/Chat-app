import endpoints from './api';

class AuthService {
  static async validateToken(token) {
    try {
      const response = await fetch(endpoints.auth.validate(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Session expired');
      }

      return await response.json();
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(endpoints.auth.login(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(endpoints.auth.logout(), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } finally {
      localStorage.removeItem('token');
    }
  }
}

export default AuthService; 