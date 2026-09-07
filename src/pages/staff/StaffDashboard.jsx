import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { useQueueStore } from '../../store/queueStore';
import { MOCK_INITIAL_BOOKINGS } from '../../utils/mockData';
import { bookingService } from '../../services/bookingService';
import RejectConsignmentModal from '../../components/staff/RejectConsignmentModal';

export default function StaffDashboard() {
  const bookings = useBookingStore((s) => s.bookings);
  const fetchAllBookings = useBookingStore((s) => s.fetchAllBookings);
  const callToCounter = useBookingStore((s) => s.callToCounter);
  const showToast = useQueueStore((s) => s.showToast);

  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'HISTORY'
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().slice(0, 10)); // Default Today YYYY-MM-DD
  const [showAllHistoryDates, setShowAllHistoryDates] = useState(false);
  const [verifiedTokens, setVerifiedTokens] = useState({});
  const [rejectingBooking, setRejectingBooking] = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  // Raw list of active and past bookings
  const rawList = bookings || [];

  // Active Queue items: WAITING, ARRIVED, PROCESSING, CONFIRMED (exclude CANCELLED, PROCURED, REJECTED)
  const activeQueueBookings = rawList.filter(
    (b) => b.status === 'WAITING' || b.status === 'ARRIVED' || b.status === 'PROCESSING' || b.status === 'CONFIRMED'
  );

  // History items: PROCURED, REJECTED
  const historyBookings = rawList.filter((b) => b.status === 'PROCURED' || b.status === 'REJECTED');

  // Filter history by date if not showing all dates
  const filteredHistoryBookings = showAllHistoryDates || !historyDate
    ? historyBookings
    : historyBookings.filter((b) => {
        const itemDate = (b.completedAt || b.rejectedAt || b.slotDate || b.createdAt || '').slice(0, 10);
        return itemDate === historyDate;
      });

  // Identify currently serving (PROCESSING) or first ARRIVED booking
  const currentlyProcessing = activeQueueBookings.find((b) => b.status === 'PROCESSING');
  const arrivedList = activeQueueBookings.filter((b) => b.status === 'ARRIVED');
  const activeTokenText = currentlyProcessing
    ? currentlyProcessing.token
    : arrivedList.length > 0
    ? arrivedList[0].token
    : 'None';

  const toggleVerify = (token) => {
    setVerifiedTokens((prev) => {
      const next = { ...prev, [token]: !prev[token] };
      showToast(
        next[token]
          ? `Token ${token} Verified (RTC Bhoomi Land Record & Aadhaar matched)`
          : `Token ${token} verification reset`,
        'verified'
      );
      return next;
    });
  };

  /** Smart Call Next Farmer logic */
  const handleCallNext = async () => {
    // 1. If someone is ALREADY processing at the counter, warn staff to finish current farmer first
    if (currentlyProcessing) {
      showToast(
        `Token ${currentlyProcessing.token} (${currentlyProcessing.farmerName || 'Farmer'}) is currently at Weighbridge Bay 02! Please record weight or finish procurement first.`,
        'warning'
      );
      return;
    }

    // 2. Pick earliest arrived farmer
    const nextArrived = activeQueueBookings.find((b) => b.status === 'ARRIVED');
    if (nextArrived) {
      const targetId = nextArrived.bookingId || nextArrived.id;
      await callToCounter(targetId);
      showToast(
        `Calling Token ${nextArrived.token} (${nextArrived.farmerName || 'Farmer'}) to Counter Bay 02!`,
        'verified'
      );
      return;
    }

    // 3. If no farmer has physically arrived at gate yet, alert the first waiting farmer
    const firstWaiting = activeQueueBookings.find((b) => b.status === 'CONFIRMED' || b.status === 'WAITING');
    if (firstWaiting) {
      showToast(
        `Priority arrival alert dispatched to Token ${firstWaiting.token} (${firstWaiting.farmerName || 'Farmer'}) to report at Gate 2!`,
        'info'
      );
    } else {
      showToast('No farmers currently waiting in active queue.', 'info');
    }
  };

  const handleResetDemoData = async () => {
    bookingService.clearAll();
    await fetchAllBookings();
    showToast('All active slot bookings cleared!', 'check_circle');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Call Action */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container animate-pulse">
              Weighbridge Bay 02 &bull; Active
            </span>
            <span className="text-xs font-mono text-on-surface-variant">Inspector: M. Kumar (#409)</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface">
            Currently Calling: <span className="text-secondary font-mono">{activeTokenText}</span>
          </h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Mysore APMC Yard (Bandipalya) &bull; Gate 2 Conveyor &amp; Electronic Scale Grid
          </p>
        </div>

        {/* Staff Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap w-full sm:w-auto">
          <button
            onClick={handleCallNext}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2"
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[22px]">volume_up</span>
            <span>Call Next Farmer</span>
          </button>

          <Link
            to="/staff/procurement"
            className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-secondary-fixed text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">scale</span>
            <span>Record Weight</span>
          </Link>

          <button
            onClick={handleResetDemoData}
            className="px-3.5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-surface-container-high"
            title="Reset queue state"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Live Queue Metrics for Staff */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container">
          <span className="text-xs text-on-surface-variant block">Active Queue Slots</span>
          <span className="font-headline text-2xl font-bold text-primary mt-1 block">
            {activeQueueBookings.length} Farmers
          </span>
          <span className="text-[11px] text-on-surface-variant">Pending &amp; In-Bay</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container">
          <span className="text-xs text-on-surface-variant block">Arrived at Gate</span>
          <span className="font-headline text-2xl font-bold text-emerald-600 mt-1 block">
            {arrivedList.length} Tractors
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Ready for Counter</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container">
          <span className="text-xs text-on-surface-variant block">Completed Deals Today</span>
          <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
            {historyBookings.filter((b) => b.status === 'PROCURED').length} Deals
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">MSP Disbursed to Bank</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container">
          <span className="text-xs text-on-surface-variant block">Average Service Pace</span>
          <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
            3.5 min
          </span>
          <span className="text-[11px] text-on-surface-variant">per weighbridge slip</span>
        </div>
      </div>

      {/* Main Container with Active Queue vs History Tabs */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
        {/* Tab Header Bar */}
        <div className="p-4 sm:p-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/40">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-surface-container rounded-xl border border-surface-container-high w-fit">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ACTIVE'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">queue</span>
              <span>Active Queue ({activeQueueBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'HISTORY'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Procurement History ({historyBookings.length})</span>
            </button>
          </div>

          {/* Controls depending on active tab */}
          {activeTab === 'ACTIVE' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg border border-surface-container-high">
                Live Auto-Synced
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl border border-surface-container-high">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
                <span className="text-xs font-semibold text-on-surface-variant">Filter Date:</span>
                <input
                  type="date"
                  value={historyDate}
                  onChange={(e) => {
                    setHistoryDate(e.target.value);
                    setShowAllHistoryDates(false);
                  }}
                  className="bg-transparent text-xs font-bold text-on-surface focus:outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => setShowAllHistoryDates(!showAllHistoryDates)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  showAllHistoryDates
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-surface-container-high'
                }`}
              >
                {showAllHistoryDates ? 'Filtering: All Dates' : 'Show All Past Dates'}
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: ACTIVE QUEUE */}
        {activeTab === 'ACTIVE' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="p-4">Queue Pos</th>
                  <th className="p-4">Token ID</th>
                  <th className="p-4">Farmer Name &amp; ID</th>
                  <th className="p-4">Produce &amp; Quantity</th>
                  <th className="p-4">Arrival Status</th>
                  <th className="p-4 text-center">Docs Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {activeQueueBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] block text-on-surface-variant mb-2 mx-auto">
                        check_circle
                      </span>
                      <p className="font-bold text-sm text-on-surface">No active farmers in queue!</p>
                      <p className="text-xs mt-1">All farmers have been processed or non-arrived yet.</p>
                    </td>
                  </tr>
                ) : (
                  activeQueueBookings.map((item, idx) => {
                    const isServing = item.status === 'PROCESSING' || item.token === activeTokenText;
                    const isArrived = item.status === 'ARRIVED';
                    const isVerified = verifiedTokens[item.token];

                    return (
                      <tr
                        key={item.id || item.token || item.bookingId}
                        className={`hover:bg-surface-container-low/60 transition-colors ${
                          isServing ? 'bg-secondary-fixed/20 font-semibold' : ''
                        }`}
                      >
                        <td className="p-4 font-bold text-sm">
                          {isServing ? (
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-bold">
                              NOW
                            </span>
                          ) : (
                            `#${idx + 1}`
                          )}
                        </td>
                        <td className="p-4 font-headline font-bold text-primary text-sm font-mono">
                          {item.token}
                          {item.farmerName?.includes('Suresh') && (
                            <span className="ml-2 text-[9px] bg-primary-fixed text-primary px-1.5 py-0.5 rounded-md font-sans">
                              Suresh (Demo)
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-on-surface">
                            {item.farmerName || 'Suresh Gowda'}
                          </p>
                          <p className="text-on-surface-variant font-mono">
                            {item.kisanId || `KS-${9800 + idx}-MH`}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-on-surface">{item.cropName || 'Ragi (Finger Millet)'}</p>
                          <p className="text-on-surface-variant">{item.quantityQuintals || item.quantityQtl || 50} Qtl</p>
                        </td>

                        {/* Status Column */}
                        <td className="p-4">
                          {isServing ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 animate-pulse inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">scale</span>
                              <span>At Counter Bay 02</span>
                            </span>
                          ) : isArrived ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                              <span>Arrived at Gate</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              <span>Waiting at Home / En Route</span>
                            </span>
                          )}
                        </td>

                        {/* Docs Verification */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => toggleVerify(item.token)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 ${
                              isVerified
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isVerified ? 'check_circle' : 'pending_actions'}
                            </span>
                            <span>{isVerified ? 'Verified' : 'Verify Docs'}</span>
                          </button>
                        </td>

                        {/* Action Column */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Call to counter button */}
                            <button
                              onClick={() => {
                                if (currentlyProcessing && currentlyProcessing.token !== item.token) {
                                  showToast(
                                    `Token ${currentlyProcessing.token} is already at the counter! Finish them first.`,
                                    'warning'
                                  );
                                  return;
                                }
                                const targetId = item.bookingId || item.id;
                                callToCounter(targetId);
                                showToast(`Called Token ${item.token} to Counter!`, 'verified');
                              }}
                              disabled={!isArrived && !isServing}
                              title={
                                !isArrived && !isServing
                                  ? "Farmer has not clicked 'I've Arrived at Gate' yet"
                                  : 'Call farmer to counter'
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 ${
                                isArrived || isServing
                                  ? 'bg-primary text-on-primary hover:bg-primary-container shadow-sm'
                                  : 'bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">volume_up</span>
                              <span>Call</span>
                            </button>

                            {/* Weighment Link */}
                            <Link
                              to={`/staff/procurement?tokenId=${item.token}`}
                              className="px-3 py-1.5 bg-secondary-fixed text-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">scale</span>
                              <span>Weight</span>
                            </Link>

                            {/* Reject Button */}
                            <button
                              onClick={() => setRejectingBooking(item)}
                              className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                              title="Reject consignment"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: PROCUREMENT HISTORY */}
        {activeTab === 'HISTORY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase font-bold text-[10px] tracking-wider border-b border-surface-container">
                <tr>
                  <th className="p-4">Token &amp; ID</th>
                  <th className="p-4">Farmer Details</th>
                  <th className="p-4">Crop &amp; Quantity</th>
                  <th className="p-4">Outcome Status</th>
                  <th className="p-4">Weighbridge / Rejection Notes</th>
                  <th className="p-4">Total MSP Amount</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredHistoryBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] block text-on-surface-variant mb-2 mx-auto">
                        event_busy
                      </span>
                      <p className="font-bold text-sm text-on-surface">No completed deal records found for this date.</p>
                      <p className="text-xs mt-1 text-on-surface-variant">
                        Select another date or click "Show All Past Dates" to view complete past history logs.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredHistoryBookings.map((item) => {
                    const isProcured = item.status === 'PROCURED';
                    const isRejected = item.status === 'REJECTED';
                    const timeStr = item.completedAt || item.rejectedAt || item.slotDate || item.createdAt;

                    return (
                      <tr key={item.bookingId || item.token} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="p-4 font-headline font-bold text-primary text-sm font-mono">
                          {item.token}
                          <span className="block text-[10px] font-sans font-normal text-on-surface-variant mt-0.5">
                            {item.bookingId}
                          </span>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-on-surface">{item.farmerName || 'Farmer'}</p>
                          <p className="text-on-surface-variant font-mono text-[11px]">
                            {item.kisanId || 'KS-MANDI-KA'}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-on-surface">{item.cropName}</p>
                          <p className="text-on-surface-variant">
                            {item.procurementDetails?.netWeightQuintals || item.quantityQuintals || item.quantityQtl || 0} Qtl
                          </p>
                        </td>

                        <td className="p-4">
                          {isProcured ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              <span>Procured</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">cancel</span>
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 max-w-xs">
                          {isProcured ? (
                            <div>
                              <p className="font-mono text-xs font-bold text-on-surface">
                                Slip #{item.procurementDetails?.weighbridgeSlipNo || 'WB-9900'}
                              </p>
                              <p className="text-[11px] text-on-surface-variant">
                                Moisture: {item.procurementDetails?.moisturePercent || '11.0%'} &bull; Net: {item.procurementDetails?.netWeightQuintals || item.quantityQuintals} Qtl
                              </p>
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded mt-1 border border-emerald-300">
                                <span className="material-symbols-outlined text-[12px]">camera</span>
                                Scale Photo Audit Verified
                              </span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200">
                              {item.rejectionReason || 'Consignment did not meet minimum FAQ moisture standard.'}
                            </p>
                          )}
                        </td>

                        <td className="p-4 font-headline font-bold text-sm text-on-surface">
                          {isProcured ? (
                            <div>
                              <span className="text-emerald-700">₹{(item.estimatedTotalAmount || item.paymentDetails?.payoutAmount || 0).toLocaleString('en-IN')}</span>
                              <span className="block text-[10px] text-emerald-800 font-sans font-normal">
                                DBT Disbursed
                              </span>
                            </div>
                          ) : (
                            <span className="text-on-surface-variant font-normal">₹0 (N/A)</span>
                          )}
                        </td>

                        <td className="p-4 text-right font-mono text-[11px] text-on-surface-variant">
                          {timeStr ? new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                          <span className="block text-[10px]">
                            {timeStr ? new Date(timeStr).toLocaleDateString() : ''}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Consignment Modal */}
      {rejectingBooking && (
        <RejectConsignmentModal
          booking={rejectingBooking}
          isOpen={Boolean(rejectingBooking)}
          onClose={() => setRejectingBooking(null)}
        />
      )}
    </div>
  );
}
