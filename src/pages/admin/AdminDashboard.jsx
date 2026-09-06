import React from 'react';
import { MOCK_CENTRES } from '../../utils/mockData';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
            Sovereign Command Console
          </span>
          <span className="text-xs font-semibold text-secondary">
            DoCA Cluster Monitoring
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          APMC Regional Queue &amp; Congestion Telemetry
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Real-time analytics evaluating waiting reduction, dispatch efficiency, and MSP payouts.
        </p>
      </div>

      {/* 4 Core Macro Impact KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Farmers Serviced Today</span>
          <span className="font-headline text-3xl font-extrabold text-primary mt-1 block">
            1,420
          </span>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            +18% throughput efficiency
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Avg Physical Yard Wait</span>
          <span className="font-headline text-3xl font-extrabold text-secondary mt-1 block">
            18.4 min
          </span>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            Reduced from 72 min baseline (-74%)
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">MSP Disbursed via DBT</span>
          <span className="font-headline text-3xl font-extrabold text-on-surface mt-1 block">
            ₹28.42 Cr
          </span>
          <span className="text-xs text-on-surface-variant mt-0.5">
            100% Aadhaar NPCI Mapped
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Volume Procured</span>
          <span className="font-headline text-3xl font-extrabold text-on-surface mt-1 block">
            8,750 Qtl
          </span>
          <span className="text-xs text-on-surface-variant mt-0.5">
            Target: 12,000 Qtl (73%)
          </span>
        </div>
      </div>

      {/* Cluster Congestion Load Balancer Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-container flex items-center justify-between">
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Mandi Queue &amp; Congestion Status &bull; Karnal Cluster
            </h3>
            <p className="text-xs text-on-surface-variant">
              Live load distribution driven by deterministic recommendation algorithms.
            </p>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">4 Centrals Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px] tracking-wider border-b border-surface-container">
              <tr>
                <th className="p-4">Mandi Centre</th>
                <th className="p-4">Current Queue</th>
                <th className="p-4">Est Wait</th>
                <th className="p-4">Active Scales</th>
                <th className="p-4">Daily Quota Filled</th>
                <th className="p-4">Congestion Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {MOCK_CENTRES.map((centre) => {
                const percentFilled = Math.round((centre.procuredTodayQuintals / centre.dailyCapacityQuintals) * 100);

                return (
                  <tr key={centre.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-on-surface text-sm">{centre.name}</p>
                      <p className="text-on-surface-variant">{centre.location}</p>
                    </td>
                    <td className="p-4 font-headline text-base font-bold text-primary">
                      {centre.queueSize} Lots
                    </td>
                    <td className="p-4 font-semibold text-secondary">
                      {centre.estimatedWaitMinutes} min
                    </td>
                    <td className="p-4">
                      {centre.activeCounters} Scales Active
                    </td>
                    <td className="p-4">
                      <div className="w-32 bg-surface-container rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {centre.procuredTodayQuintals} / {centre.dailyCapacityQuintals} Qtl ({percentFilled}%)
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          centre.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : centre.status === 'BUSY'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {centre.status === 'AVAILABLE' ? 'Optimal Load' : centre.status === 'BUSY' ? 'Moderate Congestion' : 'Heavy Congestion'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
