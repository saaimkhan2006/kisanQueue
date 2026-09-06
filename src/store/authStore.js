import { create } from 'zustand';
import { authService, MOCK_STAFF_USER } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),
  role: authService.getStoredRole(),
  isAuthenticated: true,
  isLoading: false,

  login: async (identifier, password) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.login(identifier, password, 'farmer');
      set({ user, role: user.role || 'farmer', isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginStaff: async (identifier, password) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.login(identifier, password, 'staff');
      set({ user, role: 'staff', isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.register(formData);
      set({ user, role: 'farmer', isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, role: null, isAuthenticated: false });
  }
}));

