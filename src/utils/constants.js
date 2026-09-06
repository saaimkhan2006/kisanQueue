export const CROPS = [
  { id: 'RAGI', name: 'Ragi (Finger Millet)', msp: 4290, unit: 'Quintal', category: 'Kharif' },
  { id: 'PADDY_COMMON', name: 'Paddy (Common)', msp: 2300, unit: 'Quintal', category: 'Kharif' },
  { id: 'PADDY_GRADE_A', name: 'Paddy (Grade A)', msp: 2320, unit: 'Quintal', category: 'Kharif' },
  { id: 'MAIZE', name: 'Maize (Corn)', msp: 2225, unit: 'Quintal', category: 'Kharif' },
  { id: 'GRAM', name: 'Bengal Gram (Chana)', msp: 5440, unit: 'Quintal', category: 'Rabi' },
  { id: 'TUR', name: 'Tur / Red Gram (Arhar)', msp: 7550, unit: 'Quintal', category: 'Kharif' },
  { id: 'SUGARCANE', name: 'Sugarcane (FRP)', msp: 3400, unit: 'Quintal', category: 'Annual' },
  { id: 'WHEAT', name: 'Wheat', msp: 2275, unit: 'Quintal', category: 'Rabi' },
];

export const BOOKING_STATUS = {
  BOOKED: { label: 'Booked', color: 'bg-primary-fixed text-on-primary-fixed border-primary' },
  WAITING: { label: 'Remote Waiting', color: 'bg-secondary-fixed text-on-secondary-fixed border-secondary' },
  ARRIVED: { label: 'Arrived at Gate', color: 'bg-blue-100 text-blue-900 border-blue-400' },
  VERIFIED: { label: 'Doc & Quality Verified', color: 'bg-purple-100 text-purple-900 border-purple-400' },
  PROCESSING: { label: 'Procurement In Progress', color: 'bg-amber-100 text-amber-900 border-amber-400' },
  PROCURED: { label: 'Procured & Weighed', color: 'bg-emerald-100 text-emerald-900 border-emerald-400' },
  PAYMENT_PROCESSING: { label: 'DBT Direct Transfer Processing', color: 'bg-teal-100 text-teal-900 border-teal-400' },
  PAID: { label: 'DBT Disbursed to Bank', color: 'bg-green-100 text-green-900 border-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-700 border-gray-300' }
};

export const QUEUE_THRESHOLDS = {
  APPROACHING: 5, // Alert farmer to start traveling
  URGENT: 2,      // Approaching Mandi Gate immediately
  CALLED: 1,      // Token called to gate / counter
};

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const GOVT_METADATA = {
  portalName: 'KisanQueue',
  tagline: 'National Mandi Remote Queue & DBT Grid',
  ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
  department: 'Department of Consumer Affairs (DoCA)',
  helpline: '1800-180-1551',
  orderRef: 'MANDI-QUEUE-2025/REG-4',
};
