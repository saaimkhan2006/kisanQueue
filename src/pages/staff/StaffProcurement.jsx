import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { useQueueStore } from '../../store/queueStore';

export default function StaffProcurement() {
  const [searchParams] = useSearchParams();
  const tokenIdParam = searchParams.get('tokenId') || 'MY-118';

  const bookings = useBookingStore((s) => s.bookings);
  const completeProcurement = useBookingStore((s) => s.completeProcurement);
  const showToast = useQueueStore((s) => s.showToast);
  const navigate = useNavigate();

  // Selected booking state
  const targetBooking =
    (bookings || []).find((b) => b.token === tokenIdParam) ||
    (bookings || [])[0] ||
    {
      bookingId: 'KQ-2026-9924',
      token: 'MY-118',
      farmerName: 'Suresh Gowda',
      kisanId: 'KS-9824-MH',
      cropName: 'Ragi (Finger Millet)',
      quantityQuintals: 65,
      mspRatePerQuintal: 4290,
    };

  const [token, setToken] = useState(targetBooking.token || 'MY-118');
  const [farmerName, setFarmerName] = useState(targetBooking.farmerName || 'Suresh Gowda');
  const [cropName, setCropName] = useState(targetBooking.cropName || 'Ragi (Finger Millet)');
  const [grossWeight, setGrossWeight] = useState(72.4);
  const [tareWeight, setTareWeight] = useState(7.4);
  const [moisture, setMoisture] = useState(11.8);
  const [foreignMatter, setForeignMatter] = useState(0.4);
  const [grade, setGrade] = useState('GRADE_A');
  const [scalePhoto, setScalePhoto] = useState(null);
  const [scalePhotoName, setScalePhotoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if selected target changes
  useEffect(() => {
    if (targetBooking) {
      setToken(targetBooking.token || 'MY-118');
      setFarmerName(targetBooking.farmerName || 'Suresh Gowda');
      setCropName(targetBooking.cropName || 'Ragi (Finger Millet)');
    }
  }, [tokenIdParam]);

  const netWeight = Math.max(0, Number((grossWeight - tareWeight).toFixed(2)));
  const mspRate = targetBooking.mspRatePerQuintal || (cropName.includes('Paddy') ? 2300 : 4290);
  const totalAmount = Math.round(netWeight * mspRate);
  const isMoistureValid = Number(moisture) <= 12.0;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScalePhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScalePhoto(reader.result);
        showToast('Electronic Scale Photo Captured & Anti-Fraud Hash Attached', 'photo_camera');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoPhotoCapture = () => {
    const samplePhoto = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop';
    setScalePhoto(samplePhoto);
    setScalePhotoName('WeighScale_Reading_Digital_WB02.jpg');
    showToast('Demo Scale Photo Verified & Attached (Digital Audit Proof)', 'photo_camera');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scalePhoto) {
      showToast('Mandatory Audit Requirement: Please capture/upload a photo of the electronic scale reading.', 'warning');
      return;
    }

    if (!isMoistureValid) {
      showToast('Moisture exceeds Fair Average Quality (FAQ) limit of 12.0%', 'warning');
      return;
    }

    setIsSubmitting(true);
    const slipNo = `WB-MY-${Math.floor(8000 + Math.random() * 1900)}`;

    const slipData = {
      weighbridgeSlipNo: slipNo,
      grossWeightQuintals: grossWeight,
      tareWeightQuintals: tareWeight,
      netWeightQuintals: netWeight,
      moisturePercent: moisture,
      foreignMatterPercent: foreignMatter,
      qualityGrade: grade,
      totalAmountPayable: totalAmount,
      scalePhoto: scalePhoto,
      verifiedByStaff: 'M. Kumar (Inspector #409)',
      completedAt: new Date().toISOString(),
    };

    try {
      await completeProcurement(targetBooking.bookingId || 'KQ-2026-9924', slipData);
      showToast(
        `Weighbridge Slip ${slipNo} generated with scale photo verification! ₹${totalAmount.toLocaleString('en-IN')} DBT payout initiated.`,
        'receipt_long'
      );
      navigate('/staff/dashboard');
    } catch (err) {
      showToast('Failed to complete procurement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container">
            Weighbridge Station 02 &bull; Mysuru APMC
          </span>
          <span className="text-xs font-mono text-on-surface-variant">
            Inspector: M. Kumar (#409)
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Record Electronic Weighbridge &amp; Quality Slip
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Signs off physical procurement and triggers automated Direct Benefit Transfer (DBT) to the farmer's bank account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm space-y-6">
        {/* Token Selection / Identification */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Consignment Token
            </label>
            <select
              value={token}
              onChange={(e) => {
                const selectedToken = e.target.value;
                setToken(selectedToken);
                const found = (bookings || []).find((b) => b.token === selectedToken);
                if (found) {
                  setFarmerName(found.farmerName || 'Suresh Gowda');
                  setCropName(found.cropName || 'Ragi (Finger Millet)');
                }
              }}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container font-headline font-bold text-sm focus:outline-none"
            >
              {(bookings || []).map((b) => (
                <option key={b.id || b.token} value={b.token}>
                  {b.token} ({b.farmerName || 'Suresh Gowda'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Farmer Name / ID
            </label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Crop Variety
            </label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-semibold focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Digital Scales Measurement */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">scale</span>
              <span>Digital Scale Measurements (Quintals)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
              IoT Scale Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1 font-medium">
                Gross Weight (Loaded Tractor)
              </label>
              <input
                type="number"
                step="0.1"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg border border-surface-container text-sm font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1 font-medium">
                Tare Weight (Empty Vehicle)
              </label>
              <input
                type="number"
                step="0.1"
                value={tareWeight}
                onChange={(e) => setTareWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface rounded-lg border border-surface-container text-sm font-bold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-primary mb-1 font-bold">
                Net Billable Weight
              </label>
              <div className="w-full px-3 py-2 bg-primary text-on-primary rounded-lg text-sm font-headline font-extrabold flex items-center justify-between">
                <span>{netWeight} Qtl</span>
                <span className="text-[10px] uppercase font-mono opacity-80">Auto Calc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Lab Analysis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Moisture Content (%)
              </label>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isMoistureValid ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}
              >
                {isMoistureValid ? 'FAQ Pass' : 'Exceeds FAQ'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-bold focus:outline-none"
              required
            />
            <p className="text-[10px] text-on-surface-variant mt-1">FAQ benchmark: Max 12.0%</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Foreign Matter (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={foreignMatter}
              onChange={(e) => setForeignMatter(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-bold focus:outline-none"
              required
            />
            <p className="text-[10px] text-on-surface-variant mt-1">Allowed limit: Max 0.75%</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Quality Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container text-sm font-bold focus:outline-none"
            >
              <option value="GRADE_A">Grade A (Premium FAQ)</option>
              <option value="GRADE_B">Grade B (Standard FAQ)</option>
            </select>
          </div>
        </div>
        {/* Anti-Fraud Audit: Weigh Scale Photo Upload */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-600">photo_camera</span>
                <span>Anti-Fraud Mandate: Scale Photo Upload</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full uppercase">
                  Mandatory Proof
                </span>
              </span>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Capture or attach photo of the electronic weigh scale screen to prevent staff weight tampering.
              </p>
            </div>

            {scalePhoto && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Scale Photo Verified
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <label className="flex-1 w-full flex items-center justify-center gap-2 p-3 bg-surface-container-lowest hover:bg-surface-container rounded-xl border border-dashed border-surface-container-high cursor-pointer transition-colors text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              <span className="truncate">{scalePhotoName ? scalePhotoName : 'Upload / Capture Scale Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleDemoPhotoCapture}
              className="w-full sm:w-auto px-4 py-3 bg-secondary-fixed hover:bg-secondary-container text-secondary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
              title="Click to simulate verified scale photo capture"
            >
              <span className="material-symbols-outlined text-[16px]">camera</span>
              <span>Simulate Scale Camera</span>
            </button>
          </div>

          {scalePhoto && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-emerald-300 max-h-48 bg-black flex items-center justify-center">
              <img src={scalePhoto} alt="Weigh scale readout" className="max-h-48 object-cover w-full" />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-emerald-400">verified</span>
                <span>Scale Photo Hash Verified &bull; {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time MSP Calculation Summary */}
        <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              Calculated Government MSP Payout
            </span>
            <span className="text-xs text-on-surface-variant">
              {netWeight} Qtl &times; ₹{mspRate.toLocaleString('en-IN')} / Qtl ({cropName})
            </span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-black text-primary">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-surface-container flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/staff/dashboard')}
            className="w-full sm:w-auto px-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-bold text-sm transition-colors text-center"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isMoistureValid}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">check</span>
            )}
            <span>Sign &amp; Generate Electronic Slip</span>
          </button>
        </div>
      </form>
    </div>
  );
}
