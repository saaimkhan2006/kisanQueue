import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { centreService } from '../../services/centreService';
import { useBookingStore } from '../../store/bookingStore';
import { useQueueStore } from '../../store/queueStore';
import { CROPS } from '../../utils/constants';

export default function BookSlot() {
  const [searchParams] = useSearchParams();
  const preselectedCentreId = searchParams.get('centre') || 'C002'; // default recommended Nanjangud

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState(preselectedCentreId);
  const [selectedCropId, setSelectedCropId] = useState('RAGI');
  const [quantity, setQuantity] = useState(50);
  const [slotDate, setSlotDate] = useState('2026-09-06');
  const [slotTime, setSlotTime] = useState('10:00 AM - 12:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const createBooking = useBookingStore((s) => s.createBooking);
  const showToast = useQueueStore((s) => s.showToast);

  useEffect(() => {
    centreService.getCentres().then((data) => setCentres(data));
  }, []);

  const selectedCrop = CROPS.find((c) => c.id === selectedCropId) || CROPS[0];
  const selectedCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];
  const estimatedPayout = (Number(quantity) || 0) * (selectedCrop?.msp || 4290);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      showToast('Please enter a valid produce quantity in quintals', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        centreId: selectedCentre?.id || 'C001',
        centreName: selectedCentre?.name || 'Mysore (Bandipalya) APMC Central Yard',
        gate: selectedCentre?.gateNo || 'Gate 2 (Tractor Entry)',
        produceType: selectedCrop.id,
        cropName: selectedCrop.name,
        quantityQuintals: Number(quantity),
        mspRatePerQuintal: selectedCrop.msp,
        estimatedTotalAmount: estimatedPayout,
        slotDate,
        slotTime,
      };

      const booking = await createBooking(payload);
      showToast(`Slot Confirmed! Token ${booking.token} issued.`, 'check_circle');
      navigate(`/farmer/booking/${booking.bookingId}`);
    } catch (err) {
      showToast('Booking failed: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
            E-Procurement Grid
          </span>
          <span className="text-xs font-semibold text-secondary">
            Direct DBT Payout Link
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Reserve Procurement Slot &amp; Token
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Lock in your MSP quota and obtain a real-time digital queue token.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm space-y-6">
        {/* Centre Selection */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            1. Select Procurement Centre (Mandi)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {centres.map((c) => (
              <label
                key={c.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCentreId === c.id
                    ? 'bg-primary-fixed/20 border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-on-surface">{c.name}</span>
                    <input
                      type="radio"
                      name="centre"
                      checked={selectedCentreId === c.id}
                      onChange={() => setSelectedCentreId(c.id)}
                      className="text-primary focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{c.distanceKm} km away</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-surface-container/60">
                  <span className="text-secondary font-semibold">Queue: {c.queueSize} lots</span>
                  <span className="font-bold text-primary">
                    Total: {Math.floor(c.totalExpectedMinutes / 60)}h {c.totalExpectedMinutes % 60}m
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
            2. Produce Type (Crop)
          </label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {CROPS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name} &bull; MSP ₹{crop.msp.toLocaleString('en-IN')}/Qtl
              </option>
            ))}
          </select>
        </div>

        {/* Quantity in Quintals */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              3. Estimated Quantity (Quintals)
            </label>
            <span className="text-xs text-on-surface-variant">Max Single Lot: 150 Qtl</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="5"
              max="150"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50"
              className="w-full pl-4 pr-16 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
              Quintals
            </span>
          </div>
        </div>

        {/* Guaranteed MSP Payout Preview Callout */}
        <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              Estimated MSP Payout
            </span>
            <span className="text-xs text-on-surface-variant">
              {quantity || 0} Qtl &times; ₹{selectedCrop.msp.toLocaleString('en-IN')} / Qtl
            </span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-extrabold text-primary">
            ₹{estimatedPayout.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Date and Time Slot Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              4. Procurement Date
            </label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
              5. Preferred Arrival Window
            </label>
            <select
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm focus:outline-none"
            >
              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Window)</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Active Regular)</option>
              <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM (Post-Lunch)</option>
              <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Late Window)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Generating Token...</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Issue Live Token</span>
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
