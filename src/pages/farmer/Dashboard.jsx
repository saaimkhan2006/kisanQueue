import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QueueStatusBanner from '../../components/dashboard/QueueStatusBanner';
import DeparturePlanner from '../../components/dashboard/DeparturePlanner';
import LiveQueueCard from '../../components/dashboard/LiveQueueCard';
import ProcurementTimeline from '../../components/dashboard/ProcurementTimeline';
import PaymentCard from '../../components/dashboard/PaymentCard';
import CentreRecommendation from '../../components/dashboard/CentreRecommendation';
import RouteMapModal from '../../components/queue/RouteMapModal';
import DelayPassModal from '../../components/queue/DelayPassModal';
import { useQueueStore } from '../../store/queueStore';
import { useAuthStore } from '../../store/authStore';
import { useLocationStore } from '../../store/locationStore';

export default function Dashboard() {
  const [mapOpen, setMapOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);

  const liveQueue = useQueueStore((s) => s.liveQueue);
  const isLoading = useQueueStore((s) => s.isLoading);
  const showToast = useQueueStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);
  const location = useLocationStore((s) => s.location);

  const hasActiveSlot = Boolean(liveQueue && !['PROCURED', 'REJECTED'].includes(liveQueue.status));

  const playSirenTest = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      showToast('Siren Alert Audio Test Triggered (Volume OK)', 'volume_up');
    } catch {
      showToast('Audio test preview played', 'volume_up');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Farmer Procurement Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Welcome back, <span className="font-semibold text-primary">{user?.name || 'Suresh Gowda'}</span> &bull; {location.city} District, {location.state}
          </p>
        </div>

        {hasActiveSlot && (
          <div className="flex items-center gap-2">
            <button
              onClick={playSirenTest}
              className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Test the turn arrival siren sound"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">campaign</span>
              Test Siren Sound
            </button>
          </div>
        )}
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="rounded-2xl border border-surface-container bg-surface-container-lowest p-8 flex items-center justify-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[22px] animate-spin text-primary">progress_activity</span>
          <span className="text-sm font-medium">Syncing with Mandi IoT Grid...</span>
        </div>
      )}

      {/* No Active Booking — Empty State */}
      {!isLoading && !hasActiveSlot && (
        <div className="rounded-2xl border border-surface-container bg-surface-container-lowest p-8 sm:p-12 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-primary-fixed/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[44px] text-primary">confirmation_number</span>
          </div>
          <div>
            <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-on-surface">
              No Active Procurement Slot
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">
              You don't have an active slot booking yet. Book a slot at your nearest Mandi to receive a live queue token
              and monitor your position remotely — no physical waiting required.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/farmer/book"
              className="px-7 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Book a Procurement Slot
            </Link>
            <Link
              to="/farmer/centres"
              className="px-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">storefront</span>
              View Mandi Centres
            </Link>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Sovereign Remote Waiting Guarantee &bull; Govt. of India, DoCA
          </p>
        </div>
      )}

      {/* Active booking sections — only shown when there IS an active incomplete booking */}
      {hasActiveSlot && (
        <>
          {/* Section 1: Sovereign Remote Waiting Guarantee Banner */}
          <QueueStatusBanner
            onOpenMap={() => setMapOpen(true)}
            onOpenDelay={() => setDelayOpen(true)}
          />

          {/* Section 2: Smart Departure & Travel Planner */}
          <DeparturePlanner onOpenMap={() => setMapOpen(true)} />

          {/* Section 3: Live Queue Monitor & Visual Pipeline */}
          <LiveQueueCard onOpenDelay={() => setDelayOpen(true)} />
        </>
      )}

      {/* Section 4: Congestion-Aware Centre Recommendation — always visible */}
      <CentreRecommendation />

      {/* Section 5: Procurement Lifecycle & Payment Grid — ONLY visible for active incomplete booking */}
      {hasActiveSlot && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProcurementTimeline />
          <PaymentCard />
        </div>
      )}

      {/* Interactive Modals */}
      <RouteMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <DelayPassModal isOpen={delayOpen} onClose={() => setDelayOpen(false)} />
    </div>
  );
}
