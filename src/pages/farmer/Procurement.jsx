import React, { useEffect, useState } from 'react';
import { procurementService } from '../../services/procurementService';
import ProcurementTimeline from '../../components/dashboard/ProcurementTimeline';

export default function Procurement() {
  const [data, setData] = useState(null);

  useEffect(() => {
    procurementService.getProcurementDetails().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary">
            Digital Mandi Weighbridge &amp; Quality Grid
          </span>
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Procurement Status &amp; Consignment Record
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          Live stage tracking from Gate entry to digital weighbridge slip generation.
        </p>
      </div>

      {/* 4-Stage Stepper */}
      <ProcurementTimeline />

      {/* Weighbridge Electronic Slip Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-surface-container shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-surface-container">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Electronic Weighbridge Slip
            </span>
            <h3 className="font-headline text-lg font-bold text-on-surface mt-0.5">
              Slip #{data.weighbridgeSlipNo}
            </h3>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            Awaiting Gate Arrival
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Gross Weight</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
              {data.grossWeightQuintals} Qtl
            </span>
            <span className="text-xs text-on-surface-variant">Tractor + Loaded Trolley</span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <span className="text-xs text-on-surface-variant block">Tare Weight (Vehicle)</span>
            <span className="font-headline text-2xl font-bold text-on-surface mt-1 block">
              {data.tareWeightQuintals} Qtl
            </span>
            <span className="text-xs text-on-surface-variant">Empty Vehicle Weight</span>
          </div>

          <div className="bg-primary-fixed/20 p-4 rounded-xl border border-primary/30">
            <span className="text-xs text-primary font-bold uppercase tracking-wider block">
              Net Procured Weight
            </span>
            <span className="font-headline text-2xl font-extrabold text-primary mt-1 block">
              {data.netWeightQuintals} Qtl
            </span>
            <span className="text-xs text-primary font-semibold">Authorized Billable Weight</span>
          </div>
        </div>

        {/* Quality Lab Inspection Readings */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface">
            Quality Inspection (FAQ Standards)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between p-2 bg-surface-container-lowest rounded-lg border border-surface-container">
              <span className="text-on-surface-variant">Moisture Analysis:</span>
              <span className="font-bold text-emerald-800">{data.moisturePercent}</span>
            </div>
            <div className="flex justify-between p-2 bg-surface-container-lowest rounded-lg border border-surface-container">
              <span className="text-on-surface-variant">Foreign Matter / Shriveled:</span>
              <span className="font-bold text-emerald-800">{data.foreignMatterPercent}</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            Inspected by: <strong className="text-on-surface">{data.verifiedByStaff}</strong> (DoCA Certified Field Officer)
          </p>
        </div>
      </div>
    </div>
  );
}
