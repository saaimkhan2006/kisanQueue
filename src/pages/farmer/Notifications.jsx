import React from 'react';
import { MOCK_NOTIFICATIONS } from '../../utils/mockData';
import { useQueueStore } from '../../store/queueStore';

export default function Notifications() {
  const showToast = useQueueStore((s) => s.showToast);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Notifications &amp; SMS Alerts
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Real-time automated queue dispatch broadcasts and SMS delivery log.
          </p>
        </div>

        <button
          onClick={() => showToast('All notifications marked as read', 'done_all')}
          className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface transition-colors"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all ${
              !notif.read
                ? 'bg-surface-container-lowest border-primary/40 ring-1 ring-primary/20 shadow-sm'
                : 'bg-surface-container-lowest border-surface-container'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">
                    {notif.type === 'BOOKING_CONFIRMED'
                      ? 'confirmation_number'
                      : notif.type === 'QUEUE_UPDATE'
                      ? 'timelapse'
                      : 'campaign'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-on-surface">{notif.title}</h3>
                    <span className="text-[10px] font-bold bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">
                      {notif.channel}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant shrink-0">
                {notif.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
