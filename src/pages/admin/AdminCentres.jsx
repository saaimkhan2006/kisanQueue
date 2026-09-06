import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useQueueStore } from '../../store/queueStore';

export default function AdminCentres() {
  const centres = useAdminStore((s) => s.centres);
  const updateCentreCapacity = useAdminStore((s) => s.updateCentreCapacity);
  const updateActiveCounters = useAdminStore((s) => s.updateActiveCounters);
  const showToast = useQueueStore((s) => s.showToast);

  const [editingCapacityId, setEditingCapacityId] = useState(null);
  const [tempCapacity, setTempCapacity] = useState('');

  const [editingScalesId, setEditingScalesId] = useState(null);
  const [tempScales, setTempScales] = useState('');

  const handleSaveCapacity = (id) => {
    if (tempCapacity && !isNaN(tempCapacity) && Number(tempCapacity) > 0) {
      updateCentreCapacity(id, tempCapacity);
      showToast(`Updated daily capacity for Centre ${id} to ${tempCapacity} Qtl`, 'verified');
    }
    setEditingCapacityId(null);
  };

  const handleSaveScales = (centre) => {
    const val = Number(tempScales);
    if (!isNaN(val) && val >= 1 && val <= 8) {
      updateActiveCounters(centre.id, val);
      showToast(`${centre.name}: ${val} weighbridge scale${val > 1 ? 's' : ''} now active`, 'tune');
    } else {
      showToast('Enter a valid count between 1 and 8', 'warning');
    }
    setEditingScalesId(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
              Mandi Quota &amp; Capacity Control
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Procurement Centre &amp; Scale Capacity Configuration
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Modify daily intake limits, active weighbridge scales, and gate capacities for all mandis in your district.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {centres.map((centre) => {
          const isEditingCapacity = editingCapacityId === centre.id;
          const isEditingScales = editingScalesId === centre.id;
          const percentFilled = Math.min(
            100,
            Math.round((centre.procuredTodayQuintals / centre.dailyCapacityQuintals) * 100)
          );

          return (
            <div
              key={centre.id}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-on-surface-variant block">
                      ID: {centre.id} &bull; {centre.gateNo || 'Main Gate'}
                    </span>
                    <h3 className="font-headline text-lg font-bold text-on-surface mt-0.5">
                      {centre.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant">{centre.location}</p>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                      centre.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : centre.status === 'BUSY'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {centre.status}
                  </span>
                </div>

                {/* Quota Fill Visual Bar */}
                <div className="mt-4 pt-3 border-t border-surface-container">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-on-surface-variant font-medium">Daily Quota Utilization</span>
                    <span className="font-bold text-on-surface">
                      {centre.procuredTodayQuintals} / {centre.dailyCapacityQuintals} Qtl ({percentFilled}%)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        percentFilled > 80 ? 'bg-rose-500' : percentFilled > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mt-4">
                  {/* Daily Quota Card */}
                  <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex flex-col justify-between">
                    <div>
                      <span className="text-on-surface-variant block">Daily Intake Quota</span>
                      {isEditingCapacity ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={tempCapacity}
                            min="1"
                            onChange={(e) => setTempCapacity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveCapacity(centre.id)}
                            className="w-20 px-2 py-1 bg-surface-container-lowest font-bold text-sm text-primary rounded border border-primary focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveCapacity(centre.id)}
                            className="p-1 bg-primary text-on-primary rounded hover:bg-primary-container"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </button>
                          <button
                            onClick={() => setEditingCapacityId(null)}
                            className="p-1 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <span className="font-headline text-xl font-bold text-primary block mt-0.5">
                          {centre.dailyCapacityQuintals} Qtl
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setEditingCapacityId(centre.id);
                        setTempCapacity(centre.dailyCapacityQuintals.toString());
                      }}
                      className="text-[11px] font-bold text-primary hover:underline text-left mt-2 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">edit</span>
                      <span>Modify Quota</span>
                    </button>
                  </div>

                  {/* Active Weighbridges Card — inline editable */}
                  <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant block">Active Scales</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">Max: 8</span>
                      </div>

                      {isEditingScales ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={tempScales}
                            min="1"
                            max="8"
                            onChange={(e) => setTempScales(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveScales(centre)}
                            className="w-16 px-2 py-1 bg-surface-container-lowest font-bold text-sm text-secondary rounded border border-secondary focus:outline-none"
                            autoFocus
                          />
                          <span className="text-on-surface-variant text-[11px]">/ 8</span>
                          <button
                            onClick={() => handleSaveScales(centre)}
                            className="p-1 bg-secondary text-on-secondary rounded hover:bg-secondary-container"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </button>
                          <button
                            onClick={() => setEditingScalesId(null)}
                            className="p-1 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-headline text-xl font-bold text-secondary">
                            {centre.activeCounters}
                          </span>
                          {/* Mini bar chart — filled vs empty slots */}
                          <div className="flex items-end gap-0.5">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <span
                                key={i}
                                title={i < centre.activeCounters ? `Scale ${i + 1}: Active` : `Scale ${i + 1}: Offline`}
                                className={`w-2 rounded-sm transition-all ${
                                  i < centre.activeCounters ? 'h-4 bg-secondary' : 'h-2 bg-surface-container-high'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setEditingScalesId(centre.id);
                        setTempScales(centre.activeCounters.toString());
                      }}
                      className="text-[11px] font-bold text-secondary hover:underline text-left mt-2 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">edit</span>
                      <span>Set Active Scales</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                <span>Accepted Crops: Ragi, Paddy, Maize</span>
                <span className="font-mono text-[11px]">Serving Token: {centre.currentServingToken || 'Active'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
