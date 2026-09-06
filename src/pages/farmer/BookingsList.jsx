import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import CancelBookingModal from '../../components/queue/CancelBookingModal';

const STATUS_BADGE = {
  WAITING: { label: 'Waiting in Queue', color: 'bg-secondary-container text-on-secondary-container animate-pulse' },
  ARRIVED:  { label: 'Arrived at Mandi', color: 'bg-primary-container text-on-primary-container' },
  VERIFIED: { label: 'Gate Verified', color: 'bg-tertiary-container text-on-tertiary-container' },
  PROCESSING: { label: 'Weighbridge Active', color: 'bg-amber-100 text-amber-900' },
  PROCURED: { label: 'Procurement Done', color: 'bg-emerald-100 text-emerald-900' },
  PAID:     { label: 'DBT Paid', color: 'bg-emerald-200 text-emerald-900' },
};

export default function BookingsList() {
  const bookings = useBookingStore((s) => s.bookings);
  const activeBooking = useBookingStore((s) => s.activeBooking);
  const isLoading = useBookingStore((s) => s.isLoading);
  const fetchAllBookings = useBookingStore((s) => s.fetchAllBookings);
  const setActiveBooking = useBookingStore((s) => s.setActiveBooking);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            My Bookings &amp; Procurement Tokens
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {bookings.length > 0
              ? `${bookings.length} active reservation${bookings.length > 1 ? 's' : ''} across national APMC Mandis.`
              : 'Active and past procurement reservations across national APMC Mandis.'}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-3 text-on-surface-variant py-6">
          <span className="material-symbols-outlined text-[22px] animate-spin text-primary">progress_activity</span>
          <span className="text-sm">Loading bookings...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && bookings.length === 0 && (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-surface-container">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">confirmation_number</span>
          <p className="text-sm text-on-surface-variant mt-3">No bookings yet. Book your first slot to get started.</p>
          <Link
            to="/farmer/book"
            className="inline-flex mt-5 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Book a Slot
          </Link>
        </div>
      )}

      {/* Bookings list */}
      {bookings.map((booking) => {
        const isActive = activeBooking?.bookingId === booking.bookingId;
        const badge = STATUS_BADGE[booking.status] ?? { label: booking.status, color: 'bg-surface-container text-on-surface-variant' };

        return (
          <div
            key={booking.bookingId}
            className={`bg-surface-container-lowest rounded-2xl border shadow-sm transition-all ${
              isActive
                ? 'border-primary/40 ring-2 ring-primary/20'
                : 'border-surface-container hover:border-surface-container-high'
            }`}
          >
            {/* Active monitor indicator */}
            {isActive && (
              <div className="flex items-center gap-2 px-5 pt-4 pb-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Queue Monitor Active — Dashboard &amp; Live Queue tracking this booking
                </span>
              </div>
            )}

            <div className="p-5 sm:p-6">
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 mb-4 border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">{booking.bookingId}</span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{booking.centreName}</h3>
                  <p className="text-xs text-on-surface-variant">{booking.gate}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs text-on-surface-variant block">Token</span>
                  <span className="font-headline text-3xl font-black text-primary block">{booking.token}</span>
                  <span className="text-xs text-on-surface-variant">Position #{booking.currentPosition}</span>
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <span className="text-on-surface-variant block">Produce Lot</span>
                  <span className="font-bold text-on-surface text-sm block mt-0.5">{booking.cropName}</span>
                  <span className="text-on-surface-variant">{booking.quantityQuintals} Quintals</span>
                </div>

                <div className="bg-surface-container-low p-3 rounded-xl">
                  <span className="text-on-surface-variant block">MSP Payout</span>
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
                  <span className="text-on-surface-variant block">Booked On</span>
                  <span className="font-bold text-on-surface text-sm block mt-0.5">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-on-surface-variant">
                    {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-surface-container">
                {/* Switch monitor */}
                {!isActive ? (
                  <button
                    onClick={() => setActiveBooking(booking.bookingId)}
                    className="px-4 py-2 bg-primary-fixed/20 hover:bg-primary-fixed/30 text-primary border border-primary/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">radio_button_checked</span>
                    Set as Queue Monitor
                  </button>
                ) : (
                  <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">sensors</span>
                    Currently monitoring in Dashboard &amp; Live Queue
                  </span>
                )}

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
                    <span>Live Queue</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                  <button
                    onClick={() => setCancelModalBooking(booking)}
                    className="px-3 py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Cancel this booking"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <CancelBookingModal
          booking={cancelModalBooking}
          isOpen={Boolean(cancelModalBooking)}
          onClose={() => setCancelModalBooking(null)}
          onConfirm={async () => {
            const id = cancelModalBooking.bookingId;
            setCancelModalBooking(null);
            await cancelBooking(id);
          }}
        />
      )}
    </div>
  );
}
