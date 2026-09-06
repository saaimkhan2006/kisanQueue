import React from 'react';
import { useQueueStore } from '../../store/queueStore';

export default function RouteMapModal({ isOpen, onClose }) {
  const liveQueue = useQueueStore((s) => s.liveQueue);
  const showToast = useQueueStore((s) => s.showToast);

  if (!isOpen || !liveQueue) return null;

  const handleLaunchGmaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        'Karnal Central APMC Mandi Gate 2'
      )}`,
      '_blank'
    );
    showToast('Redirecting to Google Maps with tractor navigation parameters', 'map');
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">navigation</span>
            </div>
            <h3 className="font-headline text-lg font-bold text-primary">
              Gate 2 Navigation Route
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Map Route Visual Placeholder / Card */}
        <div className="w-full h-48 bg-primary-container rounded-xl relative overflow-hidden mb-4 border border-primary/20 flex flex-col justify-between p-4 text-on-primary">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-secondary text-on-secondary rounded-full text-xs font-bold uppercase tracking-wider">
              Priority Tractor Corridor
            </span>
            <span className="text-xs font-mono bg-primary/80 px-2 py-0.5 rounded-md">
              Gate 02 Weighbridge Bay
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold opacity-80">Origin: Kachhwa Farm Road</p>
            <p className="text-lg font-bold">Destination: Karnal Central APMC Yard</p>
            <p className="text-xs text-primary-fixed mt-0.5">Entry restricted to Token C-117 holders</p>
          </div>
        </div>

        {/* Route Commute Specs */}
        <div className="space-y-2 mb-5 bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant font-medium">Designated Entry:</span>
            <span className="font-bold text-primary">Gate 2 (North Conveyor)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant font-medium">Distance from Farm:</span>
            <span className="font-bold text-on-surface">8.5 km (Via GT Road)</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant font-medium">Estimated Commute:</span>
            <span className="font-bold text-secondary">22 min (Tractor speed ~25 km/h)</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleLaunchGmaps}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
