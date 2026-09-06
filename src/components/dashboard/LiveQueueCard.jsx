import React from 'react';
import { Link } from 'react-router-dom';
import { useQueueStore } from '../../store/queueStore';
import VisualQueuePipeline from '../queue/VisualQueuePipeline';

export default function LiveQueueCard({ onOpenDelay }) {
  const liveQueue = useQueueStore((s) => s.liveQueue);

  if (!liveQueue) return null;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
            <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Token {liveQueue.token} Live Queue
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container uppercase animate-pulse">
                Live Stream
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {liveQueue.centreName} • {liveQueue.gate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDelay}
            className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Request 15-minute postponement window"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">update</span>
            Request 15m Delay
          </button>
          
          <Link
            to="/farmer/queue"
            className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Full Monitor</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metrics in Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Your Token */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container/60">
          <p className="text-xs font-medium text-on-surface-variant">Your Token</p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-primary mt-1">
            {liveQueue.token}
          </p>
          <p className="text-[11px] text-primary font-semibold mt-0.5">Priority Slot Verified</p>
        </div>

        {/* Position */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container/60">
          <p className="text-xs font-medium text-on-surface-variant">Queue Position</p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary mt-1">
            #{liveQueue.position}
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {liveQueue.farmersAhead} {liveQueue.farmersAhead === 1 ? 'farmer' : 'farmers'} ahead
          </p>
        </div>

        {/* Estimated Wait */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container/60">
          <p className="text-xs font-medium text-on-surface-variant">Estimated Wait</p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
            {liveQueue.estimatedWaitMinutes}{' '}
            <span className="text-base font-normal text-on-surface-variant">min</span>
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">~4 min / consignment</p>
        </div>

        {/* Currently Serving */}
        <div className="bg-secondary-fixed/20 p-4 rounded-xl border border-secondary-container/30">
          <p className="text-xs font-medium text-secondary">Currently Serving</p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-secondary mt-1">
            {liveQueue.currentlyServing}
          </p>
          <p className="text-[11px] text-secondary font-semibold mt-0.5">Weighbridge Bay 2</p>
        </div>
      </div>

      {/* Visual Queue Pipeline */}
      <VisualQueuePipeline
        tokens={liveQueue.queueTokens}
        currentServing={liveQueue.currentlyServing}
      />
    </div>
  );
}
