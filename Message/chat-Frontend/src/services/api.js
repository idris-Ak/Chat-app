const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
    getAll: (senderId, recipientId) => 
      `${API_BASE_URL}/messages?senderId=${senderId}&recipientId=${recipientId}`,
    create: () => `${API_BASE_URL}/messages`,
  }
};

export default endpoints;