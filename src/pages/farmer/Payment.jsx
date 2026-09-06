import React, { useEffect, useState } from 'react';
import { paymentService } from '../../services/paymentService';

export default function Payment() {
  const [data, setData] = useState(null);

  useEffect(() => {
    paymentService.getPaymentDetails().then(setData);
  }, []);

  if (!data) return null;

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

      {/* Main Expected Payment Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-container">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Guaranteed Sovereign Payout
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

        {/* Payment History / Audit Log */}
        <div>
          <h3 className="font-headline text-base font-bold text-on-surface mb-3">
            Recent Procurement Payout History
          </h3>
          <div className="space-y-2">
            {[
              { id: 'TXN-9821', crop: 'Mustard (सरसों) - 40 Qtl', date: 'March 24, 2026', amount: '₹2,26,000', status: 'Disbursed to SBI' },
              { id: 'TXN-8742', crop: 'Paddy Grade A - 85 Qtl', date: 'October 12, 2025', amount: '₹1,97,200', status: 'Disbursed to SBI' },
            ].map((txn) => (
              <div
                key={txn.id}
                className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-on-surface">{txn.crop}</p>
                  <p className="text-on-surface-variant font-mono">{txn.id} • {txn.date}</p>
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
    </div>
  );
}
