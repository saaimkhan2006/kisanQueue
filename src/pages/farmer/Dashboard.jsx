import React, { useState } from 'react';
import QueueStatusBanner from '../../components/dashboard/QueueStatusBanner';
import DeparturePlanner from '../../components/dashboard/DeparturePlanner';
import LiveQueueCard from '../../components/dashboard/LiveQueueCard';
import ProcurementTimeline from '../../components/dashboard/ProcurementTimeline';
import PaymentCard from '../../components/dashboard/PaymentCard';
import CentreRecommendation from '../../components/dashboard/CentreRecommendation';
import RouteMapModal from '../../components/queue/RouteMapModal';
import DelayPassModal from '../../components/queue/DelayPassModal';
import { useQueueStore } from '../../store/queueStore';

export default function Dashboard() {
  const [mapOpen, setMapOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);

  const liveQueue = useQueueStore((s) => s.liveQueue);
  const showToast = useQueueStore((s) => s.showToast);

  const playSirenTest = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      showToast('🔊 Siren Alert Audio Test Triggered (Volume OK)', 'volume_up');
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
            Welcome back, <span className="font-semibold text-primary">Rameshwar Singh</span> • Central Mandi Gate 2 Stream
          </p>
        </div>

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
      </div>

      {/* Section 1: Sovereign Remote Waiting Guarantee Banner */}
      <QueueStatusBanner
        onOpenMap={() => setMapOpen(true)}
        onOpenDelay={() => setDelayOpen(true)}
      />

      {/* Section 2: Smart Departure & Travel Planner */}
      <DeparturePlanner onOpenMap={() => setMapOpen(true)} />

      {/* Section 3: Live Queue Monitor & Visual Pipeline */}
      <LiveQueueCard onOpenDelay={() => setDelayOpen(true)} />

      {/* Section 4: Congestion-Aware Centre Recommendation */}
      <CentreRecommendation />

      {/* Section 5: Procurement Lifecycle & Payment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcurementTimeline />
        <PaymentCard />
      </div>

      {/* Interactive Modals */}
      <RouteMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <DelayPassModal isOpen={delayOpen} onClose={() => setDelayOpen(false)} />
    </div>
  );
}
