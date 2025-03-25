const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const endpoints = {
  auth: {
    login: () => `${API_BASE_URL}/auth/login`,
    logout: () => `${API_BASE_URL}/auth/logout`,
    validate: () => `${API_BASE_URL}/auth/validate`,
    register: () => `${API_BASE_URL}/auth/register`,
    verifyToken: () => `${API_BASE_URL}/auth/verify-token`
  },
  users: {
    getAll: () => `${API_BASE_URL}/users`,
    getById: (id) => `${API_BASE_URL}/users/${id}`,
  },
  messages: {
    getConversation: (userId) => `${API_BASE_URL}/messages/conversation/${userId}`,
    send: () => `${API_BASE_URL}/messages`,
    markAsRead: (messageId) => `${API_BASE_URL}/messages/mark-read/${messageId}`
  }
};

export default endpoints;