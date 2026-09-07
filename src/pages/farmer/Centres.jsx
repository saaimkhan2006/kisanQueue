import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { centreService } from '../../services/centreService';
import { CROPS } from '../../utils/constants';
import { useLocationStore } from '../../store/locationStore';

export default function Centres() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const location = useLocationStore((s) => s.location);

  const [centres, setCentres] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('totalTime'); // totalTime | distance | queue
  const [isLoading, setIsLoading] = useState(true);

  const loadCentres = useCallback(async () => {
    setIsLoading(true);
    const data = await centreService.getCentres(selectedCrop || null);
    setCentres(data);
    setIsLoading(false);
  }, [selectedCrop]);

  useEffect(() => {
    loadCentres();
  }, [loadCentres]);

  const filteredCentres = centres
    .filter((c) => {
      if (!searchQuery) return true;
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'queue') return a.queueSize - b.queueSize;
      return a.totalExpectedMinutes - b.totalExpectedMinutes;
    });

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
            APMC Mandi Directory &bull; {location.city}
          </span>
          <span className="text-xs font-semibold text-secondary">
            Deterministic Congestion Algorithm
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Find Procurement Centres &amp; Mandis
        </h1>
        <p className="text-sm text-on-surface-variant max-w-3xl mt-1">
          KisanQueue optimizes for <span className="font-bold text-on-surface">Total Turnaround Time</span> (Drive Time + Live Queue Wait + Inspection). Even if a centre is slightly farther, lower waiting time saves hours of your day.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${location.city} Mandi name, locality, or APMC yard...`}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low text-on-surface rounded-xl text-sm focus:outline-none focus:bg-surface-container"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
          {/* Crop Filter */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-low text-on-surface rounded-xl text-sm border border-surface-container focus:outline-none"
          >
            <option value="">All Crops</option>
            {CROPS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-surface-container-low text-on-surface rounded-xl text-sm border border-surface-container focus:outline-none"
          >
            <option value="totalTime">Sort: Lowest Total Time</option>
            <option value="distance">Sort: Distance</option>
            <option value="queue">Sort: Shortest Queue</option>
          </select>
        </div>
      </div>

      {/* Centres Listing */}
      {isLoading ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="text-sm text-on-surface-variant mt-2">Loading live Mandi telemetry...</p>
        </div>
      ) : filteredCentres.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-surface-container p-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            search_off
          </span>
          <h3 className="font-bold text-base text-on-surface mt-2">No Mandis Match Your Criteria</h3>
          <p className="text-xs text-on-surface-variant mt-1">Try selecting All Crops or clearing the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCentres.map((centre) => {
            const isRec = centre.recommended;

            return (
              <div
                key={centre.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isRec
                    ? 'bg-gradient-to-br from-primary-fixed/20 to-surface-container-lowest border-primary/40 ring-2 ring-primary/20 shadow-md'
                    : 'bg-surface-container-lowest border-surface-container shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      {isRec && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Lowest Turnaround Time
                        </span>
                      )}
                      <h3 className="font-headline text-lg font-bold text-on-surface">
                        {centre.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant">{centre.subTitle}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                        centre.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : centre.status === 'BUSY'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {centre.status}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mb-4">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      location_on
                    </span>
                    {centre.location} ({centre.distanceKm} km away)
                  </p>

                  {/* Recommendation explanation note */}
                  {isRec && (
                    <div className="p-3 bg-surface-container-lowest/90 rounded-xl border border-primary/20 text-xs font-medium text-primary mb-4">
                      {centre.recommendationReason}
                    </div>
                  )}

                  {/* Total Turnaround Calculation Grid */}
                  <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container/60 mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Expected Turnaround Formula
                      </span>
                      <span className="text-base font-extrabold text-primary font-headline">
                        {Math.floor(centre.totalExpectedMinutes / 60)}h {centre.totalExpectedMinutes % 60}m
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-surface-container-lowest p-2 rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Tractor Drive</span>
                        <span className="font-bold text-on-surface">{centre.travelTimeMinutes} min</span>
                      </div>
                      <div className="bg-surface-container-lowest p-2 rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Live Queue ({centre.queueSize})</span>
                        <span className="font-bold text-secondary">{centre.estimatedWaitMinutes} min</span>
                      </div>
                      <div className="bg-surface-container-lowest p-2 rounded-lg">
                        <span className="text-on-surface-variant block text-[10px]">Weigh &amp; Test</span>
                        <span className="font-bold text-on-surface">{centre.processingTimeMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                  <div className="text-xs text-on-surface-variant">
                    <span className="font-semibold text-on-surface">{centre.activeCounters} Scales</span> active
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/farmer/centres/${centre.id}`}
                      className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold transition-colors"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/farmer/book?centre=${centre.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1 bg-primary text-on-primary hover:bg-primary-container"
                    >
                      <span>Book Slot</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
