import React, { useState } from 'react';
import { useQueueStore } from '../../store/queueStore';

export default function DelayPassModal({ isOpen, onClose }) {
  const [selectedReason, setSelectedReason] = useState('transport');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestDelayPass = useQueueStore((s) => s.requestDelayPass);
  const liveQueue = useQueueStore((s) => s.liveQueue);

  if (!isOpen || !liveQueue) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await requestDelayPass(15);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <h3 className="font-headline text-lg font-bold text-on-surface">
              15-Min Queue Delay Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant mb-4">
          Need extra time? Request a one-time sovereign grace window. Your slot will be shifted back by 3 positions (~15 minutes) without penalty or cancellation.
        </p>

        {/* Reason Selection */}
        <div className="space-y-2.5 mb-5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            Select Reason for Delay:
          </label>

          {[
            { id: 'transport', label: 'Tractor / Trolley transport delay', icon: 'agriculture' },
            { id: 'harvest', label: 'Threshing or bagging in progress at farm', icon: 'psychiatry' },
            { id: 'traffic', label: 'Rural highway congestion or road closure', icon: 'traffic' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedReason === item.id
                  ? 'bg-secondary-fixed/20 border-secondary ring-1 ring-secondary'
                  : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
              }`}
            >
              <input
                type="radio"
                name="delayReason"
                checked={selectedReason === item.id}
                onChange={() => setSelectedReason(item.id)}
                className="text-secondary focus:ring-secondary"
              />
              <span className="material-symbols-outlined text-secondary text-[18px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium text-on-surface">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Adjustment Summary */}
        <div className="p-3.5 bg-surface-container-low rounded-xl mb-5 border border-surface-container">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Adjustment Summary
          </p>
          <div className="flex justify-between items-center mt-1.5 text-sm">
            <span className="text-on-surface font-medium">Current Position:</span>
            <span className="font-bold text-primary">#{liveQueue.position}</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
            <span className="text-on-surface font-medium">New Position after Shift:</span>
            <span className="font-bold text-secondary">#{liveQueue.position + 3} (+15m Window)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">check</span>
            )}
            Confirm Pass Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
