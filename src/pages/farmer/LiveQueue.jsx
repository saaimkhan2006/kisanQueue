import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueueStore } from '../../store/queueStore';
import { useBookingStore } from '../../store/bookingStore';
import VisualQueuePipeline from '../../components/queue/VisualQueuePipeline';
import RouteMapModal from '../../components/queue/RouteMapModal';
import DelayPassModal from '../../components/queue/DelayPassModal';
import CancelBookingModal from '../../components/queue/CancelBookingModal';
import { formatTime } from '../../utils/timeUtils';

export default function LiveQueue() {
  const [mapOpen, setMapOpen] = useState(false);
  const [delayOpen, setDelayOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [arrivingId, setArrivingId] = useState(null); // bookingId currently being marked arrived

  const liveQueue = useQueueStore((s) => s.liveQueue);
  const allQueues = useQueueStore((s) => s.allQueues);
  const switchActiveQueue = useQueueStore((s) => s.switchActiveQueue);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const markArrived = useBookingStore((s) => s.markArrived);
  const showToast = useQueueStore((s) => s.showToast);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Synchronized with APMC Yard IoT Hub (Latency: 12ms)', 'sync');
    }, 600);
  };

  const handleShareWhatsApp = () => {
    if (!liveQueue) return;
    showToast(`Token ${liveQueue.token} and Gate Entry QR sent to WhatsApp (+91 98451 23456)`, 'send');
  };

  const playSiren = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      showToast('Turn Siren Alert Audio Test Triggered', 'campaign');
    } catch {
      showToast('Audio siren test', 'campaign');
    }
  };

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      showToast('Procurement slot reservation cancelled successfully.', 'check_circle');
    } catch {
      showToast('Failed to cancel slot. Please try again.', 'error');
    }
  };

  const handleMarkArrived = async (bookingId) => {
    setArrivingId(bookingId);
    try {
      await markArrived(bookingId);
      showToast('Gate check-in confirmed! Staff can now see you have arrived. 🎉', 'where_to_vote');
    } catch {
      showToast('Check-in failed. Please try again.', 'error');
    } finally {
      setArrivingId(null);
    }
  };

  // If no queues exist, render an empty state
  if (!liveQueue && (!allQueues || allQueues.length === 0)) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-10">
        <div className="text-center p-8 sm:p-12 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 flex items-center justify-center text-primary mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">timelapse</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            No Active Procurement Queues
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mt-2 mb-6">
            You do not currently have any active queue tokens. Book a slot at your nearest APMC Mandi to monitor your live position remotely.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/farmer/book"
              className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Book Slot Now</span>
            </Link>
            <Link
              to="/farmer/centres"
              className="px-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-sm font-semibold"
            >
              Find Mandi Centres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isApproaching = liveQueue && liveQueue.position <= 5;
  const isCalled = liveQueue && liveQueue.position === 1;
  const isArrived = liveQueue && liveQueue.status === 'ARRIVED';
  const isProcessing = liveQueue && liveQueue.status === 'PROCESSING';

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
              APMC-MYS-HUB #01 &bull; Active Queues: {allQueues.length}
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Live Queue &bull; Real-Time Mandi Monitor
          </h1>
          <p className="text-sm text-on-surface-variant">
            {liveQueue ? `${liveQueue.centreName} • ${liveQueue.gate} (${liveQueue.cropName})` : 'All Active Reservations'}
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

          {liveQueue && (
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>WhatsApp Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* MULTI-QUEUE SECTION: Show ALL Active Booking Queues */}
      {allQueues.length > 0 && (
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">format_list_bulleted</span>
              <h2 className="font-headline text-base font-bold text-on-surface">
                All Active Booking Queues ({allQueues.length})
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant">
              Select any queue below to view full live telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allQueues.map((q) => {
              const isSelected = liveQueue && liveQueue.bookingId === q.bookingId;
              return (
                <div
                  key={q.bookingId}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-primary-fixed/20 border-primary ring-2 ring-primary/30 shadow-sm'
                      : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                  }`}
                  onClick={() => switchActiveQueue(q.bookingId)}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-headline font-black text-primary text-xl">
                        {q.token}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isSelected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {isSelected ? 'Focused Monitor' : 'Tap to Focus'}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-on-surface leading-tight">
                      {q.centreName}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {q.cropName} &bull; {q.quantityQuintals} Qtl
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-surface-container/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-on-surface-variant block text-[10px]">Position</span>
                      <span className="font-headline font-extrabold text-secondary text-sm">
                        #{q.position}
                      </span>
                      <span className="text-[10px] text-on-surface-variant ml-1">({q.estimatedWaitMinutes}m wait)</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleCancelClick(q)}
                        className="px-2.5 py-1 bg-error/10 hover:bg-error/20 text-error rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        title="Cancel this booking"
                      >
                        <span className="material-symbols-outlined text-[13px]">cancel</span>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {liveQueue && (
        <>
          {/* Main Waiting Advisory Card */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isProcessing
                ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                : isCalled
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
                    isProcessing
                      ? 'bg-amber-600 text-white animate-bounce shadow-md'
                      : isCalled
                      ? 'bg-error text-on-error animate-bounce'
                      : isApproaching
                      ? 'bg-secondary-container text-on-secondary-container animate-pulse'
                      : 'bg-primary-fixed text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {isProcessing ? 'volume_up' : isCalled ? 'notification_important' : isApproaching ? 'directions_car' : 'home_pin'}
                  </span>
                </div>

                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isProcessing
                        ? 'bg-amber-800 text-amber-100'
                        : isCalled
                        ? 'bg-error text-on-error'
                        : isApproaching
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-secondary-container/20 text-secondary'
                    }`}
                  >
                    {isProcessing
                      ? '🎯 YOU ARE BEING CALLED AT COUNTER BAY 02'
                      : isCalled
                      ? 'ENTRY GATE CALLED'
                      : isApproaching
                      ? 'COMMUTE TIME REACHED'
                      : 'REMOTE GUARANTEE ACTIVE'}
                  </span>

                  <h2 className="font-headline text-xl sm:text-2xl font-extrabold text-on-surface mt-1.5">
                    {isProcessing
                      ? `Token ${liveQueue.token}: Proceed to Weighbridge Bay 02 Now!`
                      : isCalled
                      ? `Token ${liveQueue.token} Called to Gate Entry!`
                      : isApproaching
                      ? `Approaching Turn: Start Driving to Mandi (~${liveQueue.commuteMinutes}m commute)`
                      : 'Relax at Home: Real-Time Dispatch will alert you at Position #5'}
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {isProcessing
                      ? 'Mandi Inspector M. Kumar is ready at Electronic Scale #02 to record net consignment weight.'
                      : 'Gate entry is officially guaranteed once called. No farmer needs to wait on the highway.'}
                  </p>
                </div>
              </div>

              {/* Quick Departure Summary & Actions */}
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
                    Assigned Token
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary">
                    {liveQueue.cropName}
                  </span>
                </div>
                <p className="font-headline text-5xl font-black text-primary mt-2">
                  {liveQueue.token}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Consignment: {liveQueue.quantityQuintals} Quintals &bull; RFID Pass Mapped
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
                  Weighbridge Bay 02 &bull; Automated RFID Scale
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
                    ~4 min / consignment
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Turn Time & Postponement / Cancel */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Estimated Turn Time
                </span>
                <p className="font-headline text-4xl font-extrabold text-on-surface mt-2">
                  {formatTime(liveQueue.expectedTurnTime)}
                </p>
                <p className="text-xs text-secondary font-semibold mt-1">
                  ~{liveQueue.estimatedWaitMinutes} minutes total wait remaining
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-container flex flex-col gap-2">
                {/* I've Arrived Button — shown only when status is WAITING (not yet arrived) */}
                {!isArrived && !isProcessing && (
                  <button
                    onClick={() => handleMarkArrived(liveQueue.bookingId)}
                    disabled={arrivingId === liveQueue.bookingId}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {arrivingId === liveQueue.bookingId ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">where_to_vote</span>
                    )}
                    <span>{arrivingId === liveQueue.bookingId ? 'Checking In...' : "I've Arrived at Gate"}</span>
                  </button>
                )}

                {/* Arrived banner */}
                {isArrived && (
                  <div className="w-full py-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
                    <span className="text-xs font-bold text-emerald-800">Gate Check-In Confirmed — Staff Notified</span>
                  </div>
                )}

                {/* Processing banner */}
                {isProcessing && (
                  <div className="w-full py-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-center gap-2 animate-pulse">
                    <span className="material-symbols-outlined text-[16px] text-amber-700">scale</span>
                    <span className="text-xs font-bold text-amber-800">You are at the Weighbridge Counter!</span>
                  </div>
                )}

                <button
                  onClick={() => setDelayOpen(true)}
                  className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">more_time</span>
                  <span>Need More Time? Request 15m Grace</span>
                </button>

                <button
                  onClick={() => handleCancelClick(liveQueue)}
                  className="w-full py-2 bg-error/10 hover:bg-error/20 text-error rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  <span>Cancel This Booking</span>
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
        </>
      )}

      {/* Modals */}
      <RouteMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <DelayPassModal isOpen={delayOpen} onClose={() => setDelayOpen(false)} />
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        booking={bookingToCancel}
      />
    </div>
  );
}
