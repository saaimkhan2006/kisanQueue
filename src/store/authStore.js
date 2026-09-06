import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: true,
  isLoading: false,

  login: async (identifier, password) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.login(identifier, password);
      set({ user, isAuthenticated: true, isLoading: false });
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
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  }
}));
