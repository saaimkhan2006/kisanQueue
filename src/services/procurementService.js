import { bookingService } from './bookingService';

export const procurementService = {
  async getProcurementDetails() {
    const booking = await bookingService.getMyActiveBooking();
    if (!booking) return null;
    return {
      bookingId: booking.bookingId,
      token: booking.token,
      status: booking.status,
      cropName: booking.cropName,
      quantityQuintals: booking.quantityQuintals,
      ...booking.procurementDetails,
    };
  }
};
