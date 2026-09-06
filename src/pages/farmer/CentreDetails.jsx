import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { centreService } from '../../services/centreService';
import { CROPS } from '../../utils/constants';

export default function CentreDetails() {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCentre();
  }, [id]);

  const loadCentre = async () => {
    setIsLoading(true);
    const data = await centreService.getCentreById(id);
    setCentre(data);
    setIsLoading(false);
  };

  if (isLoading || !centre) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/farmer/centres"
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to All Mandis
      </Link>

      {/* Main Centre Overview */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
                Government Procurement Centre
              </span>
              <span className="text-xs font-mono text-on-surface-variant">
                ID: {centre.id}
              </span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
              {centre.name}
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">{centre.subTitle}</p>
          </div>

          <Link
            to={`/farmer/book?centre=${centre.id}`}
            className="px-6 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <span>Book Slot at this Centre</span>
            <span className="material-symbols-outlined text-[18px]">event_available</span>
          </Link>
        </div>

        {/* 4 Stats Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Distance from Farm</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
              {centre.distanceKm} km
            </span>
            <span className="text-[11px] text-on-surface-variant">~{centre.travelTimeMinutes} min drive</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Live Queue</span>
            <span className="font-headline text-2xl font-bold text-secondary mt-1 block">
              {centre.queueSize} Lots
            </span>
            <span className="text-[11px] text-on-surface-variant">~{centre.estimatedWaitMinutes} min wait</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Daily Quota</span>
            <span className="font-headline text-2xl font-bold text-primary mt-1 block">
              {centre.dailyCapacityQuintals} Qtl
            </span>
            <span className="text-[11px] text-on-surface-variant">{centre.procuredTodayQuintals} Qtl done</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Active Counters</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
              {centre.activeCounters} Scales
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Automated RFID</span>
          </div>
        </div>

        {/* Accepted Crops & Quota Rules */}
        <div className="space-y-4">
          <h3 className="font-headline text-base font-bold text-on-surface">
            Accepted Produce &amp; MSP Rates for this Season
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CROPS.filter((c) => centre.acceptedCrops.includes(c.id)).map((crop) => (
              <div
                key={crop.id}
                className="p-3.5 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-on-surface">{crop.name}</p>
                  <p className="text-xs text-on-surface-variant">Season: {crop.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-primary">₹{crop.msp.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-on-surface-variant">per Quintal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Entry & Logistics Details */}
        <div className="mt-6 pt-6 border-t border-surface-container space-y-3">
          <h3 className="font-headline text-base font-bold text-on-surface">
            Yard Logistics &amp; Entry Guidelines
          </h3>
          <div className="text-xs text-on-surface-variant space-y-2 leading-relaxed bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <p>
              • <strong className="text-on-surface">Designated Tractor Gate:</strong> {centre.gateNo}. Automatic ANPR &amp; RFID barcode scanning upon entry.
            </p>
            <p>
              • <strong className="text-on-surface">Remote Waiting Assurance:</strong> Do not arrive early. Arriving within your 15-minute scheduled call window prevents yard congestion.
            </p>
            <p>
              • <strong className="text-on-surface">Moisture Tolerance:</strong> Food Corporation of India (FCI) fair average quality (FAQ) moisture content strictly &lt; 12.0%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
