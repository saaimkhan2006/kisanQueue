import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueueStore } from '../../store/queueStore';

export default function StaffProcurement() {
  const [token, setToken] = useState('C-117');
  const [farmerName, setFarmerName] = useState('Rameshwar Singh');
  const [grossWeight, setGrossWeight] = useState(72.4);
  const [tareWeight, setTareWeight] = useState(7.4);
  const [moisture, setMoisture] = useState(11.8);
  const [foreignMatter, setForeignMatter] = useState(0.4);
  const [grade, setGrade] = useState('GRADE_A');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = useQueueStore((s) => s.showToast);
  const navigate = useNavigate();

  const netWeight = Math.max(0, Number((grossWeight - tareWeight).toFixed(2)));
  const mspRate = 2275;
  const totalAmount = Math.round(netWeight * mspRate);
  const isMoistureValid = Number(moisture) <= 12.0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMoistureValid) {
      showToast('Moisture exceeds Fair Average Quality (FAQ) limit of 12.0%', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Weighbridge Slip WB-9924 generated for Token ${token}! DBT payout initiated.`, 'receipt_long');
      navigate('/staff/dashboard');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container">
            Weighbridge Station 04
          </span>
          <span className="text-xs font-mono text-on-surface-variant">
            DoCA Electronic Scale Grid
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Record Electronic Weighbridge &amp; Quality Slip
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Signs off physical procurement and triggers automated Direct Benefit Transfer (DBT).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm space-y-6">
        {/* Token and Farmer Identification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5">
              Consignment Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low text-on-surface rounded-xl border border-surface-container font-headline font-bold text-base focus:outline-none"
              required
            />
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
        </div>

        {/* Weights Section */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface block">
            Digital Scale Measurements (Quintals)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1 font-medium">
                Gross Weight (Loaded)
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
                <span className="text-[10px] uppercase font-mono opacity-80">Auto</span>
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
            <p className="text-[10px] text-on-surface-variant mt-1">Allowed limit: 0.75%</p>
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
              <option value="GRADE_A">Grade A (Premium Seed)</option>
              <option value="GRADE_B">Grade B (Standard)</option>
            </select>
          </div>
        </div>

        {/* Real-Time MSP Calculation Summary */}
        <div className="p-4 bg-primary-fixed/20 rounded-xl border border-primary/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">
              Calculated MSP Payout
            </span>
            <span className="text-xs text-on-surface-variant">
              {netWeight} Qtl &times; ₹{mspRate} / Qtl
            </span>
          </div>
          <span className="font-headline text-2xl sm:text-3xl font-black text-primary">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
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
