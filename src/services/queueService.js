import { bookingService } from './bookingService';

function mapBookingToQueueTelemetry(booking) {
  if (!booking) return null;
  return {
    bookingId: booking.bookingId,
    token: booking.token,
    position: booking.currentPosition,
    farmersAhead: Math.max(0, booking.currentPosition - 1),
    estimatedWaitMinutes: booking.estimatedWaitMinutes,
    currentlyServing: booking.currentlyServing,
    centreId: booking.centreId,
    centreName: booking.centreName,
    gate: booking.gate,
    cropName: booking.cropName,
    produceType: booking.produceType,
    quantityQuintals: booking.quantityQuintals,
    status: booking.status,
    expectedTurnTime: booking.expectedTurnTime,
    recommendedDepartureTime: booking.recommendedDepartureTime,
    commuteMinutes: booking.commuteMinutes,
    commuteDistanceKm: booking.commuteDistanceKm,
    routeDesc: booking.routeDesc,
    queueTokens: booking.queueTokens || [],
    lastSync: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

export const queueService = {
  async getLiveQueue(bookingId = null) {
    if (bookingId) {
      const all = await bookingService.getAllBookings();
      const found = all.find((b) => b.bookingId === bookingId);
      return mapBookingToQueueTelemetry(found);
    }
    const booking = await bookingService.getMyActiveBooking();
    return mapBookingToQueueTelemetry(booking);
  },

  async getAllActiveQueues() {
    const all = await bookingService.getAllBookings();
    return all.map(mapBookingToQueueTelemetry).filter(Boolean);
  },

  async requestDelayPass(minutes = 15, targetBookingId = null) {
    await new Promise((r) => setTimeout(r, 300));
    const all = await bookingService.getAllBookings();
    const target = targetBookingId
      ? all.find((b) => b.bookingId === targetBookingId)
      : await bookingService.getMyActiveBooking();

    if (!target) return null;

    const newPosition = target.currentPosition + 3;
    const updated = {
      ...target,
      currentPosition: newPosition,
      farmersAhead: newPosition - 1,
      estimatedWaitMinutes: target.estimatedWaitMinutes + minutes,
      expectedTurnTime: new Date(Date.now() + (target.estimatedWaitMinutes + minutes) * 60 * 1000).toISOString(),
    };
    bookingService.updateBookingInPlace(updated);
    return mapBookingToQueueTelemetry(updated);
  },
};
