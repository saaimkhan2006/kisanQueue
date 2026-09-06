import { create } from 'zustand';
import { bookingService } from '../services/bookingService';
import { useQueueStore } from './queueStore';

export const useBookingStore = create((set, get) => ({
  bookings: [],          // all bookings, newest first
  activeBooking: null,   // the booking currently shown in the queue monitor
  isLoading: false,
  error: null,

  /** Load the full bookings list + active booking */
  fetchAllBookings: async () => {
    set({ isLoading: true });
    try {
      const [bookings, active] = await Promise.all([
        bookingService.getAllBookings(),
        bookingService.getMyActiveBooking(),
      ]);
      set({ bookings, activeBooking: active, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  /** Convenience — just refresh the active booking (used by Layout on mount) */
  fetchActiveBooking: async () => {
    set({ isLoading: true });
    try {
      const [bookings, active] = await Promise.all([
        bookingService.getAllBookings(),
        bookingService.getMyActiveBooking(),
      ]);
      set({ bookings, activeBooking: active, isLoading: false });
      return active;
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createBooking: async (payload) => {
    set({ isLoading: true });
    try {
      const newBooking = await bookingService.createBooking(payload);
      // Prepend to list, set as active
      set((state) => ({
        bookings: [newBooking, ...state.bookings],
        activeBooking: newBooking,
        isLoading: false,
      }));
      // Sync the live queue dashboard with the new booking's token & position
      await useQueueStore.getState().fetchLiveQueue();
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
      const updatedBookings = get().bookings.filter((b) => b.bookingId !== bookingId);
      const newActive = updatedBookings[0] ?? null;
      set({ bookings: updatedBookings, activeBooking: newActive, isLoading: false });
      // Refresh queue store — if new active exists show it, else clear
      if (newActive) {
        await useQueueStore.getState().fetchLiveQueue();
      } else {
        useQueueStore.setState({ liveQueue: null });
      }
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  /** Switch which booking is active in the queue monitor */
  setActiveBooking: async (bookingId) => {
    bookingService.setActiveBookingId(bookingId);
    const booking = get().bookings.find((b) => b.bookingId === bookingId) ?? null;
    set({ activeBooking: booking });
    await useQueueStore.getState().fetchLiveQueue();
  },

  /** Farmer taps "I've Arrived at Gate" */
  markArrived: async (bookingId) => {
    const updated = await bookingService.markArrived(bookingId);
    if (!updated) return;
    set((state) => ({
      bookings: state.bookings.map((b) => b.bookingId === bookingId ? updated : b),
      activeBooking: state.activeBooking?.bookingId === bookingId ? updated : state.activeBooking,
    }));
  },

  /** Staff: call farmer token to weighbridge counter */
  callToCounter: async (bookingId) => {
    const updated = await bookingService.callToCounter(bookingId);
    if (!updated) return;
    set((state) => ({
      bookings: state.bookings.map((b) => b.bookingId === bookingId ? updated : b),
      activeBooking: state.activeBooking?.bookingId === bookingId ? updated : state.activeBooking,
    }));
    return updated;
  },

  /** Staff: complete procurement with weighbridge data */
  completeProcurement: async (bookingId, procurementData) => {
    const updated = await bookingService.completeProcurement(bookingId, procurementData);
    if (!updated) return;
    set((state) => ({
      bookings: state.bookings.map((b) => b.bookingId === bookingId ? updated : b),
      // If this was the farmer's active booking, update it so Dashboard shows PROCURED
      activeBooking: state.activeBooking?.bookingId === bookingId ? updated : state.activeBooking,
    }));
    // Sync the farmer's liveQueue so Dashboard + LiveQueue page reflect 'PROCURED'
    const queueState = useQueueStore.getState();
    if (queueState.liveQueue?.bookingId === bookingId) {
      useQueueStore.setState((s) => ({
        liveQueue: s.liveQueue
          ? {
              ...s.liveQueue,
              status: 'PROCURED',
              position: 0,
              farmersAhead: 0,
              currentlyServing: updated.token,
              procurementDetails: procurementData,
              completedAt: updated.completedAt,
            }
          : null,
      }));
    }
    return updated;
  },

  /** Staff: reject/cancel the consignment from their side */
  rejectBooking: async (bookingId, reason) => {
    const updated = await bookingService.rejectBooking(bookingId, reason);
    if (!updated) return;
    // Keep the rejected booking in the list so farmer can see the REJECTED status
    set((state) => ({
      bookings: state.bookings.map((b) => b.bookingId === bookingId ? updated : b),
      activeBooking: state.activeBooking?.bookingId === bookingId ? updated : state.activeBooking,
    }));
    // Sync the farmer's liveQueue so Dashboard shows REJECTED with reason
    const queueState = useQueueStore.getState();
    if (queueState.liveQueue?.bookingId === bookingId) {
      useQueueStore.setState((s) => ({
        liveQueue: s.liveQueue
          ? {
              ...s.liveQueue,
              status: 'REJECTED',
              rejectionReason: reason,
              rejectedAt: updated.rejectedAt,
            }
          : null,
      }));
    }
    return updated;
  },
}));

