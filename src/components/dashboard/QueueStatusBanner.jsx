import React from 'react';
import { useQueueStore } from '../../store/queueStore';

export default function QueueStatusBanner({ onOpenMap }) {
  const liveQueue = useQueueStore((s) => s.liveQueue);

  if (!liveQueue) return null;

  const position = liveQueue.position;
  const status = liveQueue.status;
  const isProcured = status === 'PROCURED';
  const isRejected = status === 'REJECTED';
  const isCalled = position === 1 && !isProcured && !isRejected;
  const isApproaching = position <= 5 && !isCalled && !isProcured && !isRejected;

  // ── PROCURED: show green success banner ──────────────────────────
  if (isProcured) {
    const slip = liveQueue.procurementDetails;
    const payout = slip?.totalAmountPayable
      ? `₹${slip.totalAmountPayable.toLocaleString('en-IN')}`
      : liveQueue.estimatedPayment
      ? `₹${liveQueue.estimatedPayment.toLocaleString('en-IN')}`
      : null;

    return (
      <div className="w-full mb-6">
        <div className="rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden border bg-emerald-50 border-emerald-200">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-emerald-500" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-2">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm bg-emerald-500 text-white">
                <span className="material-symbols-outlined text-[26px]">check_circle</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500 text-white">
                    PROCUREMENT COMPLETE
                  </span>
                  {slip?.weighbridgeSlipNo && (
                    <span className="text-[12px] font-mono text-emerald-700">
                      Slip #{slip.weighbridgeSlipNo}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 tracking-tight">
                  Your consignment has been successfully procured!
                </h2>
                <p className="text-sm text-emerald-700 mt-1">
                  {slip
                    ? `Net Weight: ${slip.netWeightQuintals} Qtl · Moisture: ${slip.moisturePercent}% · Grade: ${slip.qualityGrade || 'Grade A'}`
                    : `Token ${liveQueue.token} — consignment weighed and accepted at ${liveQueue.centreName || 'Mysore APMC'}.`}
                </p>
              </div>
            </div>
            {payout && (
              <div className="shrink-0 bg-emerald-100 border border-emerald-300 rounded-2xl px-6 py-4 text-center">
                <span className="block text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  MSP Payout (DBT)
                </span>
                <span className="font-headline text-2xl sm:text-3xl font-black text-emerald-800">
                  {payout}
                </span>
                <span className="block text-[11px] text-emerald-600 mt-1">
                  Disbursed to your bank account
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── REJECTED: show red rejection banner ──────────────────────────
  if (isRejected) {
    return (
      <div className="w-full mb-6">
        <div className="rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden border bg-rose-50 border-rose-200">
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-rose-500" />
          <div className="flex items-start gap-4 pl-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm bg-rose-500 text-white">
              <span className="material-symbols-outlined text-[26px]">cancel</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500 text-white">
                  CONSIGNMENT REJECTED
                </span>
                <span className="text-[12px] font-mono text-rose-600">Token {liveQueue.token}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-rose-800 tracking-tight">
                Your consignment was not accepted at this visit.
              </h2>
              {liveQueue.rejectionReason && (
                <p className="text-sm text-rose-700 mt-1 bg-rose-100 border border-rose-200 rounded-xl p-3">
                  Reason: {liveQueue.rejectionReason}
                </p>
              )}
              <p className="text-sm text-rose-600 mt-2">
                You may resolve the issue and re-book a new slot. Contact the Mandi Inspector for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal queue banner ───────────────────────────────────────────
  return (
    <div className="w-full mb-6">
      <div
        className={`rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-colors border ${
          isCalled
            ? 'bg-error/5 border-error/30'
            : isApproaching
            ? 'bg-secondary-fixed/20 border-secondary-container/40'
            : 'bg-surface-container-lowest border-surface-container'
        }`}
      >
        {/* Color accent strip */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-2.5 ${
            isCalled
              ? 'bg-error'
              : isApproaching
              ? 'bg-secondary-container'
              : 'bg-gradient-to-b from-primary via-secondary-container to-secondary'
          }`}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-2">
          {/* Main Guidance Message */}
          <div className="flex items-start gap-4 max-w-3xl">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                isCalled
                  ? 'bg-error text-on-error animate-bounce'
                  : isApproaching
                  ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                  : 'bg-secondary-fixed text-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[26px]">
                {isCalled ? 'notification_important' : isApproaching ? 'directions_car' : 'home_pin'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isCalled
                      ? 'bg-error text-on-error'
                      : isApproaching
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-secondary-container/20 text-secondary'
                  }`}
                >
                  {isCalled
                    ? 'TOKEN CALLED TO COUNTER'
                    : isApproaching
                    ? 'TURN APPROACHING — TRAVEL NOW'
                    : 'REMOTE WAITING GUARANTEE'}
                </span>
                <span className="text-[12px] font-mono text-on-surface-variant">
                  Govt Order: MANDI-QUEUE-2025/REG-4
                </span>
              </div>

              {isCalled ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-error tracking-tight">
                    Token {liveQueue.token}: You have been called to Counter 04!
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Please present your Token QR code at {liveQueue.gate} weighbridge entry. Priority lane is activated for you.
                  </p>
                </>
              ) : isApproaching ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary tracking-tight">
                    You are #{position} in queue! Please begin traveling to {liveQueue.centreName}.
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Tractor commute time is ~{liveQueue.commuteMinutes} minutes. If you leave now, you will arrive exactly as your token reaches the gate.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                    Do NOT wait at the Mandi Yard. Stay comfortable at home or farm.
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    The remote dispatch system will trigger siren call, SMS, and WhatsApp alerts when your token reaches{' '}
                    <span className="font-bold text-on-surface">Queue Position #5</span>. Gate entry is guaranteed on arrival.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* IoT Telemetry Sync Pill & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center justify-between gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-xs font-semibold text-primary">Live IoT Sync</span>
              </div>
              <span className="text-xs font-mono text-on-surface-variant">{liveQueue.lastSync}</span>
            </div>

            {isApproaching && onOpenMap && (
              <button
                onClick={onOpenMap}
                className="px-4 py-2.5 bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">navigation</span>
                <span>View Gate Route</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
