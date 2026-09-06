import { MOCK_USER } from '../utils/mockData';

export const authService = {
  async login(identifier, password) {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 400));
    
    // In future: return await api.post('/auth/login', { identifier, password });
    const user = { ...MOCK_USER };
    const token = 'mock_jwt_token_kisan_queue_' + Date.now();
    localStorage.setItem('kisanqueue_jwt', token);
    localStorage.setItem('kisanqueue_user', JSON.stringify(user));
    return { user, token };
  },

  async register(registrationData) {
    await new Promise((r) => setTimeout(r, 500));
    const user = {
      ...MOCK_USER,
      ...registrationData,
      id: 'FARMER-' + Math.floor(1000 + Math.random() * 9000),
      kisanId: 'KS-' + Math.floor(1000 + Math.random() * 9000) + '-HR',
    };
    const token = 'mock_jwt_token_kisan_queue_' + Date.now();
    localStorage.setItem('kisanqueue_jwt', token);
    localStorage.setItem('kisanqueue_user', JSON.stringify(user));
    return { user, token };
  },

  getStoredUser() {
    try {
      const u = localStorage.getItem('kisanqueue_user');
      return u ? JSON.parse(u) : MOCK_USER;
    } catch {
      return MOCK_USER;
    }
  },

  logout() {
    localStorage.removeItem('kisanqueue_jwt');
    localStorage.removeItem('kisanqueue_user');
  }
};
