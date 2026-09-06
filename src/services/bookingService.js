import { MOCK_ACTIVE_BOOKING } from '../utils/mockData';

export const bookingService = {
  async getMyActiveBooking() {
    await new Promise((r) => setTimeout(r, 200));
    const stored = localStorage.getItem('kisanqueue_active_booking');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return MOCK_ACTIVE_BOOKING;
      }
    }
    return MOCK_ACTIVE_BOOKING;
  },

  async createBooking(bookingPayload) {
    await new Promise((r) => setTimeout(r, 400));
    
    // Generate token and booking ID
    const randomTokenNum = Math.floor(120 + Math.random() * 30);
    const token = `C-${randomTokenNum}`;
    const bookingId = `KQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newBooking = {
      ...MOCK_ACTIVE_BOOKING,
      ...bookingPayload,
      bookingId,
      token,
      status: 'WAITING',
      currentPosition: 14,
      farmersAhead: 13,
      estimatedWaitMinutes: 58,
      createdAt: new Date().toISOString(),
      queueTokens: [
        { token: 'C-106', status: 'SERVING', isUser: false },
        ...Array.from({ length: 12 }, (_, i) => ({
          token: `C-${107 + i}`,
          status: 'WAITING',
          isUser: false,
        })),
        { token, status: 'WAITING', isUser: true },
        { token: `C-${randomTokenNum + 1}`, status: 'WAITING', isUser: false },
      ],
    };

    localStorage.setItem('kisanqueue_active_booking', JSON.stringify(newBooking));
    return newBooking;
  },

  async cancelBooking(bookingId) {
    await new Promise((r) => setTimeout(r, 300));
    localStorage.removeItem('kisanqueue_active_booking');
    return { success: true, bookingId };
  }
};
