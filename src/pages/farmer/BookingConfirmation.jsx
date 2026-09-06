import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useQueueStore } from '../../store/queueStore';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const showToast = useQueueStore((s) => s.showToast);

  useEffect(() => {
    bookingService.getAllBookings().then((list) => {
      const found = list.find((b) => b.bookingId === id) ?? list[0] ?? null;
      setBooking(found);
    });
  }, [id]);

  if (!booking) return null;

  const handleWhatsApp = () => {
    showToast(`Token ${booking.token} entry pass sent to registered WhatsApp (+91 98451 23456)`, 'send');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Banner */}
      <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-md text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-primary-container text-primary-fixed mx-auto flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[28px]">check_circle</span>
        </div>
        <span className="text-xs uppercase tracking-widest text-primary-fixed font-bold">
          Slot Confirmed &bull; Token Active
        </span>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold mt-1">
          Procurement Token Issued
        </h1>
        <p className="text-xs sm:text-sm text-primary-fixed-dim max-w-md mx-auto mt-1">
          Do not travel to the Mandi Yard now. Your position is in the remote queue.
        </p>
      </div>

      {/* Official Token Pass Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-surface-container">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Your Live Queue Token
            </span>
            <p className="font-headline text-5xl font-black text-primary mt-1">
              {booking.token}
            </p>
            <p className="text-xs font-mono text-on-surface-variant mt-1">
              Ref: {booking.bookingId}
            </p>
          </div>

          {/* QR Code Mockup */}
          <div className="flex flex-col items-center p-3 bg-surface-container-low rounded-xl border border-surface-container">
            <div className="w-24 h-24 bg-on-surface flex items-center justify-center rounded-lg p-2">
              <span className="material-symbols-outlined text-surface text-[64px]">
                qr_code_2
              </span>
            </div>
            <span className="text-[10px] font-mono text-on-surface-variant mt-1 uppercase">
              {booking.gate} Pass
            </span>
          </div>
        </div>

        {/* Consignment & Payout Summary */}
        <div className="grid grid-cols-2 gap-4 py-5 border-b border-surface-container text-sm">
          <div>
            <span className="text-xs text-on-surface-variant block">Centre &amp; Gate</span>
            <span className="font-bold text-on-surface block mt-0.5">{booking.centreName}</span>
            <span className="text-xs text-secondary font-semibold">{booking.gate}</span>
          </div>

          <div>
            <span className="text-xs text-on-surface-variant block">Produce &amp; Lot Size</span>
            <span className="font-bold text-on-surface block mt-0.5">{booking.cropName}</span>
            <span className="text-xs text-on-surface-variant">{booking.quantityQuintals} Quintals</span>
          </div>

          <div>
            <span className="text-xs text-on-surface-variant block">Estimated MSP Payout</span>
            <span className="font-bold text-primary text-base block mt-0.5">
              ₹{booking.estimatedTotalAmount?.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Direct DBT to Canara Bank ****8492</span>
          </div>

          <div>
            <span className="text-xs text-on-surface-variant block">Arrival Window</span>
            <span className="font-bold text-on-surface block mt-0.5">{booking.slotTime}</span>
            <span className="text-xs text-on-surface-variant">{booking.slotDate}</span>
          </div>
        </div>

        {/* Remote Waiting Instructions */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container mt-5 text-xs text-on-surface-variant space-y-1">
          <p className="font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
            Sovereign Remote Waiting Rule
          </p>
          <p>
            Stay comfortable at home. When the queue moves to Position #5, we will notify you by siren, SMS, and WhatsApp with estimated departure time.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <Link
            to="/farmer/queue"
            className="w-full sm:flex-1 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all text-center shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">timelapse</span>
            <span>Monitor Live Queue Remotely</span>
          </Link>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px] text-emerald-700">send</span>
            <span>WhatsApp Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}
