import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useQueueStore } from '../../store/queueStore';

export default function EditMspModal({ isOpen, onClose }) {
  const mspRates = useAdminStore((s) => s.mspRates);
  const updateMspRate = useAdminStore((s) => s.updateMspRate);
  const showToast = useQueueStore((s) => s.showToast);

  const [rates, setRates] = useState(mspRates);

  if (!isOpen) return null;

  const handleChange = (cropKey, val) => {
    setRates((prev) => ({
      ...prev,
      [cropKey]: val,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    Object.entries(rates).forEach(([cropKey, newRate]) => {
      updateMspRate(cropKey, newRate);
    });
    showToast('Official MSP Government Commodity Rates Updated Successfully!', 'verified');
    onClose();
  };

  const CROP_LABELS = {
    RAGI: 'Ragi (Finger Millet)',
    PADDY_GRADE_A: 'Paddy (Grade A)',
    PADDY_COMMON: 'Paddy (Common)',
    MAIZE: 'Maize (Corn)',
    TUR: 'Tur / Arhar Dal',
    GRAM: 'Bengal Gram (Chana)',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-surface-container shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">currency_rupee</span>
            <div>
              <h3 className="font-headline text-lg font-bold">Government MSP Rate Modifier</h3>
              <p className="text-xs text-primary-fixed-dim">DoCA Central Price Fixation Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-primary-container/20 hover:bg-primary-container/40 text-on-primary flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs text-on-surface-variant">
            Adjusting official Minimum Support Price (MSP) rates dynamically recalculates estimated farmer payouts, weighment totals, and DBT bank disbursements region-wide.
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {Object.entries(CROP_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between gap-3"
              >
                <div>
                  <label className="font-bold text-xs text-on-surface block">{label}</label>
                  <span className="text-[10px] text-on-surface-variant font-mono">Commodity Code: {key}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-on-surface">₹</span>
                  <input
                    type="number"
                    value={rates[key] ?? ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-28 px-3 py-1.5 bg-surface-container-lowest font-mono font-bold text-sm text-primary rounded-lg border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <span className="text-[11px] text-on-surface-variant">/ Qtl</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Publish Updated MSP Rates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
