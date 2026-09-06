import React, { useState } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { useQueueStore } from '../../store/queueStore';

const KARNATAKA_DISTRICTS = [
  'Mysore',
  'Mandya',
  'Hassan',
  'Chamarajanagar',
  'Bengaluru Rural',
  'Tumakuru',
  'Shivamogga',
  'Belagavi',
];

export default function EditLocationModal({ isOpen, onClose }) {
  const location = useLocationStore((s) => s.location);
  const updateLocation = useLocationStore((s) => s.updateLocation);
  const showToast = useQueueStore((s) => s.showToast);

  const [cityInput, setCityInput] = useState(location.city);
  const [districtInput, setDistrictInput] = useState(location.district);
  const [stateInput, setStateInput] = useState(location.state);

  if (!isOpen) return null;

  const handleSelectDistrict = (dist) => {
    setCityInput(dist);
    setDistrictInput(dist);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    updateLocation(cityInput.trim(), districtInput.trim() || cityInput.trim(), stateInput.trim() || 'Karnataka');
    showToast(`Location updated to ${cityInput.trim()}, ${stateInput.trim() || 'Karnataka'}`, 'location_on');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">edit_location_alt</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Change Procurement Location
              </h3>
              <p className="text-xs text-on-surface-variant">
                Set active Mandi cluster &amp; farmer district
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Quick Select Karnataka Districts */}
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              Quick Select Karnataka District:
            </label>
            <div className="flex flex-wrap gap-2">
              {KARNATAKA_DISTRICTS.map((dist) => (
                <button
                  type="button"
                  key={dist}
                  onClick={() => handleSelectDistrict(dist)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    cityInput.toLowerCase() === dist.toLowerCase()
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Custom City and State inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                City / Mandi Hub
              </label>
              <input
                type="text"
                required
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g. Mysore"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                placeholder="Karnataka"
                className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Update Location</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
