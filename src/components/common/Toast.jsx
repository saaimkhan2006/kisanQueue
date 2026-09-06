import React from 'react';
import { useQueueStore } from '../../store/queueStore';

export default function Toast() {
  const toast = useQueueStore((s) => s.toast);
  const clearToast = useQueueStore((s) => s.clearToast);

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50 animate-bounce-short flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-2xl shadow-2xl border border-surface-container-high/20 max-w-md">
      <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">
        {toast.type || 'check_circle'}
      </span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={clearToast}
        className="text-inverse-on-surface/60 hover:text-inverse-on-surface p-1"
        aria-label="Dismiss"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
