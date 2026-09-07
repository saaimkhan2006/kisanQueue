import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueueStore } from '../../store/queueStore';

export default function DemoFloatingBar() {
  const [isOpen, setIsOpen] = useState(false);
  const liveQueue = useQueueStore((s) => s.liveQueue);
  const simulateNext = useQueueStore((s) => s.simulateStaffNextToken);
  const resetQueue = useQueueStore((s) => s.resetQueueToInitial);

  if (!liveQueue) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-3 right-3 sm:left-4 sm:right-auto lg:left-80 z-40 max-w-full">
      {isOpen ? (
        <div className="bg-primary-container text-on-primary p-3.5 rounded-2xl shadow-2xl border border-primary-fixed/30 flex flex-col sm:flex-row items-center gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">
              smart_toy
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-fixed">
              SIH Demo:
            </span>
            <span className="text-xs bg-primary px-2 py-0.5 rounded-full font-mono text-secondary-fixed">
              Pos #{liveQueue.position} (Serving: {liveQueue.currentlyServing})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={simulateNext}
              className="px-3 py-1.5 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
              title="Advances live queue: Simulates staff completing counter inspection"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Call Next
            </button>

            <button
              onClick={resetQueue}
              className="px-2.5 py-1.5 bg-surface/10 hover:bg-surface/20 text-on-primary rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
              title="Reset queue to position #12"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset
            </button>

            <span className="text-primary-fixed-dim">|</span>

            {/* Quick Portal Switchers */}
            <Link
              to="/staff/dashboard"
              className="px-2.5 py-1.5 bg-secondary-fixed text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">badge</span>
              Staff
            </Link>

            <Link
              to="/admin/dashboard"
              className="px-2.5 py-1.5 bg-primary hover:bg-primary/80 text-primary-fixed rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-primary-fixed/30"
            >
              <span className="material-symbols-outlined text-[14px]">monitoring</span>
              Admin
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-surface/10 rounded-lg text-primary-fixed-dim ml-1"
              aria-label="Close demo bar"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-fixed hover:bg-primary-container rounded-full text-xs font-bold shadow-xl border border-primary-fixed/20 transition-all hover:scale-105"
          title="Open SIH Live Queue Demo Simulation Bar"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">
            tune
          </span>
          <span>SIH Demo Sim &bull; Pos #{liveQueue.position}</span>
        </button>
      )}
    </div>
  );
}
