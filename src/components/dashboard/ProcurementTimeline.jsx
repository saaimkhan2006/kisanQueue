import React from 'react';
import { Link } from 'react-router-dom';

const STAGES = [
  { id: 'BOOKED', label: 'Booking Confirmed', icon: 'check_circle', status: 'completed', desc: 'Slot & MSP quota locked' },
  { id: 'WAITING', label: 'Remote Waiting', icon: 'timer', status: 'current', desc: 'Monitored via IoT dispatch' },
  { id: 'VERIFIED', label: 'Gate Verification', icon: 'verified_user', status: 'upcoming', desc: 'Aadhaar & Land check' },
  { id: 'PROCURED', label: 'Weighbridge & Payout', icon: 'scale', status: 'upcoming', desc: 'Moisture <12% & DBT credit' },
];

export default function ProcurementTimeline() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">conversion_path</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              Procurement Lifecycle Tracker
            </h3>
            <p className="text-xs text-on-surface-variant">
              Stage 2 of 4 • Digital consignment pipeline
            </p>
          </div>
        </div>

        <Link
          to="/farmer/procurement"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>View Details</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

      {/* Responsive Horizontal Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {STAGES.map((stage, idx) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border relative transition-all ${
                isCurrent
                  ? 'bg-secondary-fixed/20 border-secondary ring-2 ring-secondary/20 shadow-sm'
                  : isCompleted
                  ? 'bg-primary-fixed/20 border-primary/30 text-on-surface'
                  : 'bg-surface-container-low border-surface-container/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-primary text-on-primary'
                      : isCurrent
                      ? 'bg-secondary text-on-secondary animate-pulse'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </span>

                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isCompleted
                      ? 'text-primary'
                      : isCurrent
                      ? 'text-secondary'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {stage.icon}
                </span>
              </div>

              <p className="font-semibold text-sm text-on-surface leading-tight">
                {stage.label}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
