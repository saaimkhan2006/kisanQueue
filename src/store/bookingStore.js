import { create } from 'zustand';
import { bookingService } from '../services/bookingService';

export const useBookingStore = create((set, get) => ({
  activeBooking: null,
  isLoading: false,
  error: null,

  fetchActiveBooking: async () => {
    set({ isLoading: true });
    try {
      const booking = await bookingService.getMyActiveBooking();
      set({ activeBooking: booking, isLoading: false });
      return booking;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createBooking: async (payload) => {
    set({ isLoading: true });
    try {
      const newBooking = await bookingService.createBooking(payload);
      set({ activeBooking: newBooking, isLoading: false });
      return newBooking;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  cancelBooking: async (bookingId) => {
    set({ isLoading: true });
    try {
      await bookingService.cancelBooking(bookingId);
      set({ activeBooking: null, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  }
}));
