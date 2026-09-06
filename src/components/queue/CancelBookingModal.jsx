import React, { useState } from 'react';

export default function CancelBookingModal({ isOpen, onClose, onConfirm, booking }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(booking.bookingId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">cancel</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Cancel Procurement Slot
              </h3>
              <p className="text-xs text-on-surface-variant">
                Release Mandi Queue Reservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Warning Alert */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-xs text-rose-900 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Are you sure you want to cancel this booking?
          </p>
          <p>
            Your assigned token and reserved weighbridge queue slot will be released back to the general APMC quota.
          </p>
        </div>

        {/* Booking Details Summary */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container space-y-2 mb-5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Token Number:</span>
            <span className="font-headline font-black text-primary text-base">{booking.token}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Mandi Centre:</span>
            <span className="font-bold text-on-surface text-right">{booking.centreName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Produce &amp; Lot:</span>
            <span className="font-semibold text-on-surface">{booking.cropName} ({booking.quantityQuintals} Qtl)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Queue Position:</span>
            <span className="font-bold text-secondary">#{booking.position || booking.currentPosition}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
          >
            Keep Slot
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-error text-on-error font-bold text-xs hover:bg-error/90 transition-colors shadow-sm flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            )}
            <span>Confirm Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
