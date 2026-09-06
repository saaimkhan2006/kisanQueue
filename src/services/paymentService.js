import { bookingService } from './bookingService';

export const paymentService = {
  async getPaymentDetails() {
    const booking = await bookingService.getMyActiveBooking();
    return {
      bookingId: booking.bookingId,
      token: booking.token,
      cropName: booking.cropName,
      quantityQuintals: booking.quantityQuintals,
      mspRate: booking.mspRatePerQuintal,
      totalExpectedAmount: booking.estimatedTotalAmount,
      ...booking.paymentDetails,
    };
  }
};
