import React, { useState } from 'react';
import { useQueueStore } from '../../store/queueStore';
import VisualQueuePipeline from '../../components/queue/VisualQueuePipeline';
import RouteMapModal from '../../components/queue/RouteMapModal';
import DelayPassModal from '../../components/queue/DelayPassModal';
import { formatTime, getMinutesFromNow } from '../../utils/timeUtils';

export default function LiveQueue() {
  const [mapOpen, setMapOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const liveQueue = useQueueStore((s) => s.liveQueue);
  const showToast = useQueueStore((s) => s.showToast);
  const simulateNext = useQueueStore((s) => s.simulateStaffNextToken);

  if (!liveQueue) return null;

  const minutesUntilDeparture = getMinutesFromNow(liveQueue.recommendedDepartureTime);
  const isApproaching = liveQueue.position <= 5;
  const isCalled = liveQueue.position === 1;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Synchronized with APMC Yard IoT Hub (Latency: 12ms)', 'sync');
    }, 800);
  };

  const handleShareWhatsApp = () => {
    showToast('Token C-117 and Gate 2 Entry QR sent to WhatsApp (+91 98765 43210)', 'send');
  };

  const playSiren = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      showToast('🔊 Turn Siren Alert Sound Triggered', 'campaign');
    } catch {
      showToast('Audio siren test', 'campaign');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container animate-pulse">
              Live Mandi Broadcast
            </span>
            <span className="text-xs font-mono text-on-surface-variant">
              APMC-KRNL-HUB #02
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Live Queue — Real-Time Mandi Monitor
          </h1>
          <p className="text-sm text-on-surface-variant">
            {liveQueue.centreName} • {liveQueue.gate}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold border border-surface-container transition-all flex items-center gap-1.5"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-primary ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span>{isSyncing ? 'Syncing...' : 'Sync IoT Hub'}</span>
          </button>

          <button
            onClick={playSiren}
            className="px-3.5 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold border border-surface-container transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">
              campaign
            </span>
            <span>Test Siren</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>Share WhatsApp Pass</span>
          </button>
        </div>
      </div>

      {/* Main Waiting Advisory Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isCalled
            ? 'bg-error/10 border-error/40'
            : isApproaching
            ? 'bg-secondary-fixed/20 border-secondary-container/50'
            : 'bg-surface-container-lowest border-surface-container'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isCalled
                  ? 'bg-error text-on-error animate-bounce'
                  : isApproaching
                  ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                  : 'bg-primary-fixed text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">
                {isCalled ? 'notification_important' : isApproaching ? 'directions_car' : 'home_pin'}
              </span>
            </div>

            <div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isCalled
                    ? 'bg-error text-on-error'
                    : isApproaching
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-secondary-container/20 text-secondary'
                }`}
              >
                {isCalled
                  ? 'ENTRY GATE CALLED'
                  : isApproaching
                  ? 'COMMUTE TIME REACHED'
                  : 'REMOTE GUARANTEE ACTIVE'}
              </span>

              <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-on-surface mt-1.5">
                {isCalled
                  ? `Token ${liveQueue.token} Called to Gate 2 Entry!`
                  : isApproaching
                  ? `Approaching Turn: Start Driving to Mandi (~${liveQueue.commuteMinutes}m commute)`
                  : 'Relax at Home: Real-time Dispatch will alert you at Position #5'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Gate entry is officially guaranteed once called. No farmer needs to queue on the highway.
              </p>
            </div>
          </div>

          {/* Quick Departure Summary */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <div className="text-left sm:text-right pr-2 sm:border-r border-surface-container">
              <p className="text-[11px] font-medium text-on-surface-variant">Recommended Departure</p>
              <p className="text-lg font-bold text-secondary">{formatTime(liveQueue.recommendedDepartureTime)}</p>
            </div>
            <button
              onClick={() => setMapOpen(true)}
              className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>Gate Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Your Token & Position Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Your Assigned Token
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                Wheat Lot #4
              </span>
            </div>
            <p className="font-headline text-5xl font-black text-primary mt-2">
              {liveQueue.token}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Consignment: 65 Quintals • RFID Pass Mapped
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-container flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Queue Position</p>
              <p className="font-headline text-3xl font-extrabold text-secondary">
                #{liveQueue.position}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant font-medium">Ahead of You</p>
              <p className="font-headline text-2xl font-bold text-on-surface">
                {liveQueue.farmersAhead}
              </p>
            </div>
          </div>
        </div>

        {/* Currently Serving Counter Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Currently Serving at Gate
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
            </div>
            <p className="font-headline text-5xl font-black text-secondary mt-2">
              {liveQueue.currentlyServing}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Weighbridge Counter 02 • S. K. Verma (Inspector)
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-container flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant font-medium">Operational Bays</p>
              <p className="font-headline text-xl font-bold text-primary">
                4 Active Scales
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant font-medium">Avg Pace</p>
              <p className="font-headline text-xl font-bold text-on-surface">
                ~4 min / truck
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Turn Time & Postponement */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Estimated Gate Turn Time
            </span>
            <p className="font-headline text-4xl font-extrabold text-on-surface mt-2">
              {formatTime(liveQueue.expectedTurnTime)}
            </p>
            <p className="text-xs text-secondary font-semibold mt-1">
              ~{liveQueue.estimatedWaitMinutes} minutes total wait remaining
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-container">
            <button
              onClick={() => setDelayOpen(true)}
              className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                more_time
              </span>
              <span>Need More Time? Request 15m Grace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sequential FIFO Queue Stream */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm">
        <VisualQueuePipeline
          tokens={liveQueue.queueTokens}
          currentServing={liveQueue.currentlyServing}
        />
      </div>

      {/* Modals */}
      <RouteMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <DelayPassModal isOpen={delayOpen} onClose={() => setDelayOpen(false)} />
    </div>
  );
}
