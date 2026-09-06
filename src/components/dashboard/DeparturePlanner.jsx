import React from 'react';
import { useQueueStore } from '../../store/queueStore';
import { formatTime, getMinutesFromNow } from '../../utils/timeUtils';

export default function DeparturePlanner({ onOpenMap }) {
  const liveQueue = useQueueStore((s) => s.liveQueue);

  if (!liveQueue) return null;

  const minutesUntilDeparture = getMinutesFromNow(liveQueue.recommendedDepartureTime);
  const isTimeToGo = liveQueue.position <= 5 || minutesUntilDeparture <= 5;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">departure_board</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-primary">
              Smart Departure &amp; Travel Planner
            </h3>
            <p className="text-xs text-on-surface-variant">
              Synchronized with {liveQueue.gate} weighbridge entry quota
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface-variant">
          Tractor Speed (25 km/h)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Estimated Commute */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container/60">
          <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">commute</span>
            Estimated Commute
          </p>
          <p className="text-2xl font-bold text-on-surface mt-1">
            {liveQueue.commuteMinutes}{' '}
            <span className="text-sm font-normal text-on-surface-variant">min</span>
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {liveQueue.commuteDistanceKm} km ({liveQueue.routeDesc})
          </p>
        </div>

        {/* Recommended Departure */}
        <div className={`p-4 rounded-xl border ${isTimeToGo ? 'bg-secondary-fixed/30 border-secondary-container' : 'bg-surface-container-low border-surface-container/60'}`}>
          <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">alarm</span>
            Recommended Departure
          </p>
          <p className={`text-2xl font-bold mt-1 ${isTimeToGo ? 'text-secondary' : 'text-on-surface'}`}>
            {formatTime(liveQueue.recommendedDepartureTime)}
          </p>
          <p className="text-xs text-secondary font-semibold mt-0.5">
            {isTimeToGo ? 'Depart immediately!' : `Leave in ~${minutesUntilDeparture} minutes`}
          </p>
        </div>

        {/* Expected Turn Time */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container/60">
          <p className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
            Expected Turn at Gate
          </p>
          <p className="text-2xl font-bold text-primary mt-1">
            {formatTime(liveQueue.expectedTurnTime)}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">Counter 04 Entry Window</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[16px]">info</span>
          <span>
            Calculated to eliminate idle queue parking at Mandi yard.
          </span>
        </div>

        <button
          onClick={onOpenMap}
          className="w-full sm:w-auto px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">navigation</span>
          View Gate Route Guidance
        </button>
      </div>
    </div>
  );
}
