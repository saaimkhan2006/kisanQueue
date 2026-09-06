import React, { useState } from 'react';
import { MOCK_CENTRES } from '../../utils/mockData';
import { useQueueStore } from '../../store/queueStore';

export default function AdminCentres() {
  const [centres, setCentres] = useState(MOCK_CENTRES);
  const showToast = useQueueStore((s) => s.showToast);

  const handleToggleScale = (id) => {
    setCentres((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newScales = c.activeCounters >= 4 ? 2 : c.activeCounters + 1;
          showToast(`Updated ${c.name}: Active scales adjusted to ${newScales}`, 'tune');
          return { ...c, activeCounters: newScales };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
            Cluster Configuration
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Procurement Centre &amp; Slot Management
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Configure daily yard quotas, active weighbridge scales, and automated queue limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {centres.map((centre) => (
          <div
            key={centre.id}
            className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-on-surface-variant block">
                  ID: {centre.id} &bull; {centre.gateNo}
                </span>
                <h3 className="font-headline text-lg font-bold text-on-surface mt-0.5">
                  {centre.name}
                </h3>
                <p className="text-xs text-on-surface-variant">{centre.location}</p>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  centre.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {centre.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <span className="text-on-surface-variant block">Daily Quota</span>
                <span className="font-bold text-base text-primary block mt-0.5">
                  {centre.dailyCapacityQuintals} Qtl
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container">
                <span className="text-on-surface-variant block">Active Weighbridges</span>
                <span className="font-bold text-base text-secondary block mt-0.5">
                  {centre.activeCounters} Scales
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container">
              <span className="text-xs text-on-surface-variant">
                Queue: {centre.queueSize} waiting
              </span>

              <button
                onClick={() => handleToggleScale(centre.id)}
                className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
                <span>Adjust Scale Capacity</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
