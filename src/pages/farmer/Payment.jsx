import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useAuthStore } from '../../store/authStore';

export default function Payment() {
  const [data, setData] = useState(null);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    async function loadPaymentData() {
      try {
        const bookings = await bookingService.getAllBookings();
        const active = await bookingService.getMyActiveBooking();

        if (active && !['PROCURED', 'REJECTED'].includes(active.status)) {
          setData({
            bookingId: active.bookingId,
            token: active.token,
            cropName: active.cropName,
            quantityQuintals: active.quantityQuintals,
            mspRate: active.mspRatePerQuintal,
            totalExpectedAmount: active.estimatedTotalAmount,
            accountMasked: active.paymentDetails?.accountMasked || user?.bankAccount?.accountMasked || 'Canara Bank ****8492',
            ifsc: active.paymentDetails?.ifsc || user?.bankAccount?.ifsc || 'CNRB0001234',
            status: active.status,
          });
        } else {
          setData(null);
        }

        // Get all completed (PROCURED) bookings
        const procuredBookings = bookings.filter((b) => b.status === 'PROCURED');
        setCompletedPayments(procuredBookings);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    loadPaymentData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-[32px] animate-spin text-primary">progress_activity</span>
      </div>
    );
  }

  // Baseline mock payment history items for display
  const staticHistory = [
    { id: 'TXN-9821', crop: 'Ragi (Finger Millet) - 40 Qtl', date: 'March 24, 2026', amount: '₹1,71,600', status: 'Payment Done • Disbursed via DBT' },
    { id: 'TXN-8742', crop: 'Paddy Grade A - 85 Qtl', date: 'October 12, 2025', amount: '₹1,97,200', status: 'Payment Done • Disbursed via DBT' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary-fixed text-tertiary">
            Direct Benefit Transfer (DBT) Grid
          </span>
          <span className="text-xs font-semibold text-secondary">
            Ministry of Consumer Affairs &amp; Farmers Welfare
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Payment Status &amp; MSP Disbursal Ledger
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Track official MSP payments directly transferred to your Aadhaar-linked bank account.
        </p>
      </div>

      {/* Main Payment Section: Only shown for incomplete transactions */}
      {data ? (
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Guaranteed Sovereign Payout (Active Transaction)
              </span>
              <p className="font-headline text-4xl sm:text-5xl font-black text-primary mt-1">
                ₹{data.totalExpectedAmount?.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {data.quantityQuintals} Quintals {data.cropName} @ ₹{data.mspRate} / Qtl
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl shrink-0">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">pending</span>
                Payment Processing
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Initiates automatically upon weighbridge slip signoff.
              </p>
            </div>
          </div>

          {/* Banking and Aadhaar NPCI Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <span className="text-xs text-on-surface-variant block">Receiving Account</span>
              <span className="font-bold text-base text-on-surface mt-1 block">
                {data.accountMasked}
              </span>
              <span className="text-xs font-mono text-on-surface-variant">
                IFSC: {data.ifsc}
              </span>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
              <span className="text-xs text-on-surface-variant block">Aadhaar Payment Bridge (APB)</span>
              <span className="font-bold text-base text-emerald-800 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                NPCI Seeding Verified
              </span>
              <span className="text-xs text-on-surface-variant">
                Aadhaar ****8921 Active for Direct Credit
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-surface-container-lowest rounded-2xl border border-surface-container text-center py-8 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <h3 className="font-headline text-lg font-bold text-on-surface">No Pending Transactions</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
            You currently have no active or pending slot payments. Completed transaction payouts are listed below in your payment history ledger.
          </p>
          <Link
            to="/farmer/book"
            className="inline-flex mt-4 px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Book a Procurement Slot</span>
          </Link>
        </div>
      )}

      {/* Payment History / Audit Log */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
        <h3 className="font-headline text-base font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">history</span>
          Completed Procurement Payout History
        </h3>
        
        <div className="space-y-2">
          {/* Render real completed (PROCURED) bookings first */}
          {completedPayments.map((booking) => {
            const amount = booking.procurementDetails?.netWeightQuintals
              ? booking.procurementDetails.netWeightQuintals * booking.mspRatePerQuintal
              : booking.estimatedTotalAmount;

            const dateStr = booking.completedAt
              ? new Date(booking.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : booking.slotDate;

            return (
              <div
                key={booking.bookingId}
                className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface">{booking.cropName} - {booking.quantityQuintals} Qtl</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Payment Done
                    </span>
                  </div>
                  <p className="text-on-surface-variant font-mono mt-0.5">
                    {booking.bookingId} &bull; {dateStr} &bull; Slip: {booking.procurementDetails?.weighbridgeSlipNo || 'WB-COMPLETED'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-900 text-sm">₹{amount.toLocaleString('en-IN')}</p>
                  <p className="text-emerald-700 font-semibold text-[11px]">Disbursed via DBT</p>
                </div>
              </div>
            );
          })}

          {/* Static history items */}
          {staticHistory.map((txn) => (
            <div
              key={txn.id}
              className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-on-surface">{txn.crop}</p>
                <p className="text-on-surface-variant font-mono mt-0.5">{txn.id} • {txn.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-sm">{txn.amount}</p>
                <p className="text-emerald-700 font-semibold">{txn.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
