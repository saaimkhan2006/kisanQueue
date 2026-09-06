import React from 'react';
import { useQueueStore } from '../../store/queueStore';

export default function QueueStatusBanner({ onOpenMap }) {
  const liveQueue = useQueueStore((s) => s.liveQueue);

  if (!liveQueue) return null;

  const position = liveQueue.position;
  const isCalled = position === 1;
  const isApproaching = position <= 5 && !isCalled;

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
