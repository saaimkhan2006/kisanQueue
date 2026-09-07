import React, { useState } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { useQueueStore } from '../../store/queueStore';

export default function RejectConsignmentModal({ booking, isOpen, onClose }) {
  const [reason, setReason] = useState('MOISTURE_EXCEEDED');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rejectBooking = useBookingStore((s) => s.rejectBooking);
  const showToast = useQueueStore((s) => s.showToast);

  if (!isOpen || !booking) return null;

  const REASON_OPTIONS = [
    { value: 'MOISTURE_EXCEEDED', label: 'Moisture Content Exceeds FAQ Limit (> 12.0%)' },
    { value: 'FOREIGN_MATTER_HIGH', label: 'Foreign Matter / Impurities Exceed FAQ Limit (> 0.75%)' },
    { value: 'QUANTITY_MISMATCH', label: 'Discrepancy in Quantity / Bags Count' },
    { value: 'INVALID_DOCUMENTS', label: 'RTC / Land Registration Document Mismatch' },
    { value: 'QUALITY_GRADE_FAIL', label: 'Crop Quality Below Minimum Support Price (MSP) Specs' },
    { value: 'OTHER', label: 'Other Operational / Regulatory Reason' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalReasonText =
      reason === 'OTHER' && customReason
        ? customReason
        : REASON_OPTIONS.find((r) => r.value === reason)?.label || reason;

    setIsSubmitting(true);
    try {
      const targetId = booking.bookingId || booking.id;
      await rejectBooking(targetId, finalReasonText);
      showToast(`Consignment ${booking.token} rejected (${finalReasonText}). Notification sent to farmer.`, 'warning');
      onClose();
    } catch (err) {
      showToast('Failed to reject consignment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest border border-surface-container rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Reject Consignment #{booking.token}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Farmer: <span className="font-semibold text-on-surface">{booking.farmerName || 'Suresh Gowda'}</span> ({booking.cropName || 'Ragi'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
          <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">warning</span>
          <p>
            Rejecting this consignment will cancel the current procurement slot, log the rejection cause in official records, and notify the farmer on their Kisan SIH dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Primary Rejection Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-xs font-semibold focus:outline-none focus:border-rose-500"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {reason === 'OTHER' && (
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
                Specify Custom Reason
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter detailed reason for rejection..."
                rows={2}
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          )}

          <div className="pt-3 border-t border-surface-container flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-bold transition-colors"
            >
              Cancel / Return
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              )}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
