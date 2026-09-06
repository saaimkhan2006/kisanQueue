import { bookingService } from './bookingService';

export const queueService = {
  async getLiveQueue() {
    const booking = await bookingService.getMyActiveBooking();
    return {
      token: booking.token,
      position: booking.currentPosition,
      farmersAhead: Math.max(0, booking.currentPosition - 1),
      estimatedWaitMinutes: booking.estimatedWaitMinutes,
      currentlyServing: booking.currentlyServing,
      centreName: booking.centreName,
      gate: booking.gate,
      expectedTurnTime: booking.expectedTurnTime,
      recommendedDepartureTime: booking.recommendedDepartureTime,
      commuteMinutes: booking.commuteMinutes,
      queueTokens: booking.queueTokens,
      lastSync: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  },

  async requestDelayPass(minutes = 15) {
    await new Promise((r) => setTimeout(r, 400));
    const booking = await bookingService.getMyActiveBooking();
    
    // Shift position back by +3 spots (approx 15 mins)
    const newPosition = booking.currentPosition + 3;
    const updated = {
      ...booking,
      currentPosition: newPosition,
      farmersAhead: newPosition - 1,
      estimatedWaitMinutes: booking.estimatedWaitMinutes + minutes,
      expectedTurnTime: new Date(Date.now() + (booking.estimatedWaitMinutes + minutes) * 60 * 1000).toISOString(),
    };
    localStorage.setItem('kisanqueue_active_booking', JSON.stringify(updated));
    return updated;
  }
};
