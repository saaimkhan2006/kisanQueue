import { MOCK_USER } from '../utils/mockData';

export const MOCK_STAFF_USER = {
  id: 'STAFF-409',
  name: 'M. Kumar',
  role: 'staff',
  designation: 'Procurement Inspector',
  badgeNo: '#409',
  yard: 'Mysore APMC Yard (Bandipalya)',
  yardId: 'C001',
  phone: '+91 98450 12345',
  email: 'm.kumar@apmc.karnataka.gov.in',
};

export const authService = {
  async login(identifier, password, role = 'farmer') {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 400));
    
    let user = { ...MOCK_USER, role: 'farmer' };
    if (role === 'staff' || identifier.includes('staff') || identifier.includes('kumar') || identifier === 'STAFF-409') {
      user = { ...MOCK_STAFF_USER };
    } else if (role === 'admin' || identifier.includes('admin')) {
      user = {
        id: 'ADMIN-001',
        name: 'District Director APMC',
        role: 'admin',
        designation: 'District Director',
        badgeNo: '#ADM-01',
        yard: 'Mysore District APMC Headquarters',
      };
    }

    const token = 'mock_jwt_token_kisan_queue_' + Date.now();
    localStorage.setItem('kisanqueue_jwt', token);
    localStorage.setItem('kisanqueue_user', JSON.stringify(user));
    localStorage.setItem('kisanqueue_role', user.role || 'farmer');
    return { user, token };
  },

  async register(registrationData) {
    await new Promise((r) => setTimeout(r, 500));
    const user = {
      ...MOCK_USER,
      ...registrationData,
      id: 'FARMER-' + Math.floor(1000 + Math.random() * 9000),
      kisanId: 'KS-' + Math.floor(1000 + Math.random() * 9000) + '-KA',
      role: 'farmer',
    };
    const token = 'mock_jwt_token_kisan_queue_' + Date.now();
    localStorage.setItem('kisanqueue_jwt', token);
    localStorage.setItem('kisanqueue_user', JSON.stringify(user));
    localStorage.setItem('kisanqueue_role', 'farmer');
    return { user, token };
  },

  getStoredUser() {
    try {
      const u = localStorage.getItem('kisanqueue_user');
      if (!u) return { ...MOCK_USER, role: 'farmer' };
      const parsed = JSON.parse(u);
      // Auto-migrate legacy mock user
      if (parsed.name === 'Rameshwar Singh' || parsed.district === 'Karnal') {
        const updated = { ...MOCK_USER, role: parsed.role || 'farmer' };
        localStorage.setItem('kisanqueue_user', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    } catch {
      return { ...MOCK_USER, role: 'farmer' };
    }
  },

  getStoredRole() {
    try {
      const u = localStorage.getItem('kisanqueue_user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.role) return parsed.role;
      }
    } catch {}
    return localStorage.getItem('kisanqueue_role') || 'farmer';
  },

  logout() {
    localStorage.removeItem('kisanqueue_jwt');
    localStorage.removeItem('kisanqueue_user');
    localStorage.removeItem('kisanqueue_role');
  }
};


