import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useQueueStore } from '../../store/queueStore';
import { useBookingStore } from '../../store/bookingStore';
import EditMspModal from '../../components/admin/EditMspModal';

export default function AdminDashboard() {
  const mspRates = useAdminStore((s) => s.mspRates);
  const centres = useAdminStore((s) => s.centres);
  const isLoadBalancerActive = useAdminStore((s) => s.isLoadBalancerActive);
  const toggleLoadBalancer = useAdminStore((s) => s.toggleLoadBalancer);
  const showToast = useQueueStore((s) => s.showToast);
  const bookings = useBookingStore((s) => s.bookings);

  const [mspModalOpen, setMspModalOpen] = useState(false);

  // Calculate live financial procurement totals
  // Base procurement volumes across centres
  const totalVolumeQtl = centres.reduce((sum, c) => sum + c.procuredTodayQuintals, 0);

  // Total expenditure across crops based on active MSP rates
  const ragiVolume = 4850; // Qtl procured across region today
  const paddyVolume = 2800;
  const maizeVolume = 1100;

  const ragiSpend = ragiVolume * (mspRates.RAGI || 4290);
  const paddySpend = paddyVolume * (mspRates.PADDY_GRADE_A || 2320);
  const maizeSpend = maizeVolume * (mspRates.MAIZE || 2225);
  const grandTotalSpend = ragiSpend + paddySpend + maizeSpend;

  const handleExportReport = () => {
    showToast('Exporting Official DoCA Daily APMC Procurement Audit Report (PDF/CSV)...', 'download');
  };

  const handleToggleLoadBalancer = () => {
    toggleLoadBalancer();
    showToast(
      !isLoadBalancerActive
        ? 'Dynamic Cluster Load Balancer ACTIVATED! Traffic rerouted to Nanjangud sub-yard.'
        : 'Load Balancer reset to standard routing.',
      'tune'
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
              Sovereign Command Console
            </span>
            <span className="text-xs font-semibold text-secondary">
              DoCA Mysore Cluster Monitoring
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            APMC Regional Procurement &amp; Financial Control
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Real-time financial spend breakdown, MSP commodity rate controls, and cluster load balancing across 4 mandi yards.
          </p>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setMspModalOpen(true)}
            className="px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            <span>Modify MSP Rates</span>
          </button>

          <button
            onClick={handleToggleLoadBalancer}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isLoadBalancerActive
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md animate-pulse'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>{isLoadBalancerActive ? 'Load Balancer: ACTIVE' : 'Auto Load-Balance'}</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-xl text-xs font-semibold border border-surface-container transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Financial Expenditure Summary Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Total Regional Expenditure</span>
          <span className="font-headline text-3xl font-extrabold text-primary mt-1 block">
            ₹{(grandTotalSpend / 10000000).toFixed(2)} Cr
          </span>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
            100% Disbursed via Aadhaar DBT
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Total Volume Procured</span>
          <span className="font-headline text-3xl font-extrabold text-secondary mt-1 block">
            {totalVolumeQtl.toLocaleString('en-IN')} Qtl
          </span>
          <span className="text-xs text-on-surface-variant mt-0.5 block">
            Across {centres.length} APMC Central &amp; Sub-Yards
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Avg Physical Yard Wait</span>
          <span className="font-headline text-3xl font-extrabold text-on-surface mt-1 block">
            18.4 min
          </span>
          <span className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            Reduced from 72m baseline (-74%)
          </span>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
          <span className="text-xs text-on-surface-variant block font-medium">Active Farmers Serviced</span>
          <span className="font-headline text-3xl font-extrabold text-on-surface mt-1 block">
            1,420 Farmers
          </span>
          <span className="text-xs text-on-surface-variant mt-0.5 block">
            Zero Highway Stagnation Guaranteed
          </span>
        </div>
      </div>

      {/* Commodity-Wise Expenditure & Live MSP Rates Bar */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container">
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
              Commodity Expenditure Breakdown &amp; Active MSP Rates
            </h3>
            <p className="text-xs text-on-surface-variant">
              Live MSP rate configuration determines total government financial outlay across crops.
            </p>
          </div>

          <button
            onClick={() => setMspModalOpen(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Edit MSP Rates</span>
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ragi Spend Card */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-on-surface">Ragi (Finger Millet)</span>
              <span className="text-xs font-mono font-bold bg-primary-fixed text-primary px-2 py-0.5 rounded-md">
                ₹{mspRates.RAGI}/Qtl
              </span>
            </div>
            <p className="font-headline text-2xl font-extrabold text-primary mt-2">
              ₹{(ragiSpend / 100000).toFixed(2)} Lakhs
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Volume Procured: {ragiVolume} Quintals
            </p>
          </div>

          {/* Paddy Spend Card */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-on-surface">Paddy (Grade A)</span>
              <span className="text-xs font-mono font-bold bg-secondary-fixed text-secondary px-2 py-0.5 rounded-md">
                ₹{mspRates.PADDY_GRADE_A}/Qtl
              </span>
            </div>
            <p className="font-headline text-2xl font-extrabold text-secondary mt-2">
              ₹{(paddySpend / 100000).toFixed(2)} Lakhs
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Volume Procured: {paddyVolume} Quintals
            </p>
          </div>

          {/* Maize Spend Card */}
          <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-on-surface">Maize (Corn)</span>
              <span className="text-xs font-mono font-bold bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-md">
                ₹{mspRates.MAIZE}/Qtl
              </span>
            </div>
            <p className="font-headline text-2xl font-extrabold text-on-surface mt-2">
              ₹{(maizeSpend / 100000).toFixed(2)} Lakhs
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Volume Procured: {maizeVolume} Quintals
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Mandi Governance & Expenditure Grid */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
        <div className="p-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Regional APMC Mandi Governance &amp; Expenditure Grid &bull; Mysore District
            </h3>
            <p className="text-xs text-on-surface-variant">
              Detailed intake volumes, financial outlay, and active scale telemetry for each centre.
            </p>
          </div>
          <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-3 py-1 rounded-lg border border-surface-container-high">
            {centres.length} Mandi Yards Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px] tracking-wider border-b border-surface-container">
              <tr>
                <th className="p-4">Mandi Centre &amp; Gate</th>
                <th className="p-4">Total Purchased</th>
                <th className="p-4">Financial Spend (₹)</th>
                <th className="p-4">Active Scales</th>
                <th className="p-4">Daily Quota Filled</th>
                <th className="p-4 text-right">Congestion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {centres.map((centre) => {
                const percentFilled = Math.min(
                  100,
                  Math.round((centre.procuredTodayQuintals / centre.dailyCapacityQuintals) * 100)
                );
                // Approximate financial spend per centre based on ragi rate average
                const centreSpend = centre.procuredTodayQuintals * (mspRates.RAGI || 4290);

                return (
                  <tr key={centre.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-on-surface text-sm">{centre.name}</p>
                        {centre.recommended && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Auto-Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">
                        ID: {centre.id} &bull; {centre.gateNo || 'Main Gate'}
                      </p>
                    </td>

                    <td className="p-4 font-headline text-base font-extrabold text-primary">
                      {centre.procuredTodayQuintals.toLocaleString('en-IN')} Qtl
                    </td>

                    <td className="p-4 font-headline text-base font-bold text-on-surface">
                      ₹{(centreSpend / 100000).toFixed(2)} L
                    </td>

                    <td className="p-4 font-semibold text-secondary">
                      {centre.activeCounters} Active Scales
                    </td>

                    <td className="p-4">
                      <div className="w-36 bg-surface-container rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className={`h-2 rounded-full ${
                            percentFilled > 80 ? 'bg-rose-500' : percentFilled > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {centre.procuredTodayQuintals} / {centre.dailyCapacityQuintals} Qtl ({percentFilled}%)
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          centre.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : centre.status === 'BUSY'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {centre.status === 'AVAILABLE'
                          ? 'Optimal Load'
                          : centre.status === 'BUSY'
                          ? 'Moderate Load'
                          : 'Heavy Congestion'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit MSP Modal */}
      <EditMspModal
        isOpen={mspModalOpen}
        onClose={() => setMspModalOpen(false)}
      />
    </div>
  );
}
