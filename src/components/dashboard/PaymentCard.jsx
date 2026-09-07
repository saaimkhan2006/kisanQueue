import React from 'react';
import { Link } from 'react-router-dom';
import { useQueueStore } from '../../store/queueStore';
import { useAuthStore } from '../../store/authStore';

export default function PaymentCard() {
  const liveQueue = useQueueStore((s) => s.liveQueue);
  const user = useAuthStore((s) => s.user);

  if (!liveQueue || ['PROCURED', 'REJECTED'].includes(liveQueue.status)) {
    return null;
  }

  const rate = liveQueue.mspRatePerQuintal || 4290;
  const qty = liveQueue.quantityQuintals || 50;
  const amount = liveQueue.estimatedTotalAmount || (qty * rate);
  const crop = liveQueue.cropName || 'Ragi (Finger Millet)';

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Direct Benefit Transfer (DBT) Status
            </h3>
            <p className="text-xs text-on-surface-variant">
              Central MSP Sovereign Payout Grid
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          Aadhaar NPCI Linked
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low p-4 rounded-xl border border-surface-container/60 mb-4">
        <div>
          <p className="text-xs font-medium text-on-surface-variant">Estimated Guaranteed MSP Payout</p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-primary mt-1">
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {qty} Quintals {crop} (Govt MSP 2025-26)
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-medium text-on-surface-variant">Receiving Bank Account</p>
          <p className="text-sm font-bold text-on-surface mt-0.5">{user?.bankAccount?.bankName || 'Canara Bank (Mysore Main)'}</p>
          <p className="text-xs font-mono text-on-surface-variant">A/C: {user?.bankAccount?.accountMasked || '*******8492'} &bull; IFSC: {user?.bankAccount?.ifsc || 'CNRB0001234'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
          Direct bank transfer completes within 24 to 48 hours of weighbridge receipt.
        </p>

        <Link
          to="/farmer/payment"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Payment History</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
