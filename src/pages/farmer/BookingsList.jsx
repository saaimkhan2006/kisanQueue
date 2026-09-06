import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { BOOKING_STATUS } from '../../utils/constants';

export default function BookingsList() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    bookingService.getMyActiveBooking().then(setBooking);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            My Bookings &amp; Procurement Tokens
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Active and past procurement reservations across national APMC Mandis.
          </p>
        </div>

        <Link
          to="/farmer/book"
          className="px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Book New Slot</span>
        </Link>
      </div>

      {booking ? (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-primary/30 ring-2 ring-primary/20 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-surface-container">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container animate-pulse">
                  Active Booking
                </span>
                <span className="text-xs font-mono text-on-surface-variant">
                  {booking.bookingId}
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                {booking.centreName}
              </h3>
              <p className="text-xs text-on-surface-variant">{booking.gate}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-on-surface-variant block">Token</span>
              <span className="font-headline text-3xl font-black text-primary block">
                {booking.token}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 text-xs">
            <div className="bg-surface-container-low p-3 rounded-xl">
              <span className="text-on-surface-variant block">Produce Lot</span>
              <span className="font-bold text-on-surface text-sm block mt-0.5">{booking.cropName}</span>
              <span className="text-on-surface-variant">{booking.quantityQuintals} Quintals</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl">
              <span className="text-on-surface-variant block">Estimated Payout</span>
              <span className="font-bold text-primary text-sm block mt-0.5">
                ₹{booking.estimatedTotalAmount?.toLocaleString('en-IN')}
              </span>
              <span className="text-on-surface-variant">@ ₹{booking.mspRatePerQuintal}/Qtl</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl">
              <span className="text-on-surface-variant block">Arrival Slot</span>
              <span className="font-bold text-on-surface text-sm block mt-0.5">{booking.slotTime}</span>
              <span className="text-on-surface-variant">{booking.slotDate}</span>
            </div>

            <div className="bg-surface-container-low p-3 rounded-xl">
              <span className="text-on-surface-variant block">Queue Position</span>
              <span className="font-bold text-secondary text-sm block mt-0.5">#{booking.currentPosition}</span>
              <span className="text-on-surface-variant">Remote Waiting Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-surface-container">
            <span className="text-xs text-on-surface-variant">
              Issued: {new Date(booking.createdAt).toLocaleDateString()}
            </span>

            <div className="flex items-center gap-2">
              <Link
                to={`/farmer/booking/${booking.bookingId}`}
                className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-colors"
              >
                View Pass
              </Link>
              <Link
                to="/farmer/queue"
                className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
              >
                <span>Live Queue Monitor</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-surface-container p-6">
          <p className="text-sm text-on-surface-variant">No active bookings found.</p>
        </div>
      )}
    </div>
  );
}
