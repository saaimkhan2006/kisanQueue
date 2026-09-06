import React from 'react';
import { Link } from 'react-router-dom';

export default function CentreRecommendation() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">explore</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Smart Mandi Recommendation
              </h3>
              <span className="text-[10px] bg-secondary-container text-on-secondary-container font-bold px-2 py-0.5 rounded-full uppercase">
                Congestion Aware
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Calculates Total Turnaround Time = Travel + Live Queue + Counter Processing
            </p>
          </div>
        </div>

        <Link
          to="/farmer/centres"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Compare All Centres</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>

      {/* Recommended Spotlight Card */}
      <div className="bg-gradient-to-br from-primary-fixed/20 to-surface-container-low p-5 rounded-xl border border-primary/20 relative overflow-hidden mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-on-primary uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">stars</span>
                Top Recommendation for Today
              </span>
              <span className="text-xs font-semibold text-secondary">Saves ~25 mins</span>
            </div>

            <h4 className="text-lg font-bold text-primary">
              Nanjangud APMC Sub-Yard
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Industrial Area Road, Nanjangud (16.4 km &bull; 36 min tractor drive)
            </p>

            <p className="text-xs font-medium text-on-surface mt-2 bg-surface-container-lowest/80 p-2.5 rounded-lg border border-surface-container max-w-xl">
              Why this centre? Although 8.6 km farther than Bandipalya Central, Nanjangud's live queue has only <strong className="text-on-surface">3 farmers</strong> (12m wait) vs <strong className="text-on-surface">12 farmers</strong> at Bandipalya (48m wait). Total turnaround is faster!
            </p>
          </div>

          {/* Time Breakdown Pill */}
          <div className="flex flex-col items-start md:items-end shrink-0 bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-sm min-w-[200px]">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Total Expected Time
            </span>
            <span className="font-headline text-3xl font-extrabold text-primary my-0.5">
              1h 13m
            </span>
            <div className="text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
              <span>36m drive</span> + <span>12m queue</span> + <span>25m weigh</span>
            </div>
            <Link
              to="/farmer/book?centre=C002"
              className="mt-3 w-full py-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-lg transition-colors text-center shadow-sm"
            >
              Book at Nanjangud
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Comparison Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-on-surface">Mysore (Bandipalya)</span>
            <span className="text-error font-semibold">Busy</span>
          </div>
          <p className="text-xs text-on-surface-variant">7.8 km &bull; 12 in queue</p>
          <p className="text-sm font-bold text-on-surface mt-1">Total: 1h 38m</p>
        </div>

        <div className="p-3.5 rounded-xl bg-primary-fixed/20 border border-primary/30 ring-1 ring-primary/20">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-primary">Nanjangud Sub-Yard ★</span>
            <span className="text-emerald-700 font-semibold">Fast Turnaround</span>
          </div>
          <p className="text-xs text-on-surface-variant">16.4 km &bull; 3 in queue</p>
          <p className="text-sm font-bold text-primary mt-1">Total: 1h 13m (Best)</p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-on-surface">T. Narasipura Centre</span>
            <span className="text-emerald-700 font-semibold">Low Queue</span>
          </div>
          <p className="text-xs text-on-surface-variant">24.0 km &bull; 2 in queue</p>
          <p className="text-sm font-bold text-on-surface mt-1">Total: 1h 21m</p>
        </div>
      </div>
    </div>
  );
}
