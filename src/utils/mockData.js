export const MOCK_USER = {
  id: 'FARMER-9824',
  name: 'Rameshwar Singh',
  kisanId: 'KS-9824-MH',
  phone: '+91 98765 43210',
  aadhaarMasked: 'XXXX-XXXX-8921',
  village: 'Kachhwa Village',
  district: 'Karnal',
  state: 'Haryana',
  landHoldingAcres: 4.5,
  cropsGrown: ['Wheat', 'Paddy', 'Mustard'],
  bankAccount: {
    bankName: 'State Bank of India (Karnal Main)',
    accountMasked: 'XXXXXXXX8492',
    ifsc: 'SBIN0001234',
    dbtLinked: true,
  },
  role: 'FARMER',
};

export const MOCK_CENTRES = [
  {
    id: 'C001',
    name: 'Karnal Central APMC Mandi',
    subTitle: 'Central Grain Procurement Yard & Silo',
    location: 'Sector 4, GT Road, Karnal, Haryana',
    distanceKm: 8.5,
    travelTimeMinutes: 22, // at tractor speed (approx 25 km/h)
    activeCounters: 4,
    queueSize: 11,
    estimatedWaitMinutes: 47,
    processingTimeMinutes: 30,
    dailyCapacityQuintals: 3000,
    procuredTodayQuintals: 1850,
    acceptedCrops: ['WHEAT', 'PADDY_COMMON', 'PADDY_GRADE_A', 'MUSTARD'],
    currentServingToken: 'C-106',
    status: 'BUSY',
    recommended: false,
    gateNo: 'Gate 2 (Tractor Entry)',
  },
  {
    id: 'C002',
    name: 'Taraori Sub-Yard Mandi',
    subTitle: 'Modernized Automated Weighbridge Yard',
    location: 'Near Railway Station, Taraori, Karnal',
    distanceKm: 14.2,
    travelTimeMinutes: 35,
    activeCounters: 3,
    queueSize: 4,
    estimatedWaitMinutes: 15,
    processingTimeMinutes: 25,
    dailyCapacityQuintals: 2000,
    procuredTodayQuintals: 820,
    acceptedCrops: ['WHEAT', 'PADDY_GRADE_A', 'MUSTARD'],
    currentServingToken: 'T-042',
    status: 'AVAILABLE',
    recommended: true, // Lowest Total Expected Time!
    recommendationReason: 'Lowest Total Time: Even though 5.7 km farther, queue is 32 minutes faster!',
    gateNo: 'Main Gate 1',
  },
  {
    id: 'C003',
    name: 'Nilokheri Grain Procurement Centre',
    subTitle: 'DoCA Sovereign Farmers Hub',
    location: 'State Highway 9, Nilokheri, Karnal',
    distanceKm: 19.0,
    travelTimeMinutes: 45,
    activeCounters: 2,
    queueSize: 2,
    estimatedWaitMinutes: 8,
    processingTimeMinutes: 25,
    dailyCapacityQuintals: 1500,
    procuredTodayQuintals: 430,
    acceptedCrops: ['WHEAT', 'MUSTARD', 'GRAM'],
    currentServingToken: 'N-019',
    status: 'AVAILABLE',
    recommended: false,
    gateNo: 'North Gate',
  },
  {
    id: 'C004',
    name: 'Gharaunda Procurement Yard',
    subTitle: 'South Karnal APMC Yard',
    location: 'Old GT Road, Gharaunda, Haryana',
    distanceKm: 16.5,
    travelTimeMinutes: 40,
    activeCounters: 2,
    queueSize: 18,
    estimatedWaitMinutes: 75,
    processingTimeMinutes: 35,
    dailyCapacityQuintals: 2500,
    procuredTodayQuintals: 2100,
    acceptedCrops: ['WHEAT', 'PADDY_COMMON'],
    currentServingToken: 'G-088',
    status: 'HEAVY_CONGESTION',
    recommended: false,
    gateNo: 'Gate 3',
  }
];

export const MOCK_ACTIVE_BOOKING = {
  bookingId: 'KQ-2026-8924',
  token: 'C-117',
  centreId: 'C001',
  centreName: 'Karnal Central APMC Mandi',
  gate: 'Gate 2 (North Conveyor)',
  produceType: 'WHEAT',
  cropName: 'Wheat (गेहूं)',
  quantityQuintals: 65,
  mspRatePerQuintal: 2275,
  estimatedTotalAmount: 147875, // 65 * 2275
  slotDate: '2026-09-06',
  slotTime: '10:00 AM - 12:00 PM',
  status: 'WAITING', // BOOKED, WAITING, ARRIVED, VERIFIED, PROCESSING, PROCURED, PAYMENT_PROCESSING, PAID
  createdAt: '2026-09-06T08:30:00Z',
  
  // Real-time Queue Telemetry
  initialPosition: 12,
  currentPosition: 12,
  farmersAhead: 11,
  estimatedWaitMinutes: 47,
  currentlyServing: 'C-106',
  
  // Departure Planning
  commuteMinutes: 22,
  commuteDistanceKm: 8.5,
  routeDesc: 'Via GT Road (Tractor Speed)',
  expectedTurnTime: new Date(Date.now() + 47 * 60 * 1000).toISOString(),
  recommendedDepartureTime: new Date(Date.now() + (47 - 22) * 60 * 1000).toISOString(),
  
  // Visual Token Queue sequence
  queueTokens: [
    { token: 'C-106', status: 'SERVING', isUser: false },
    { token: 'C-107', status: 'WAITING', isUser: false },
    { token: 'C-108', status: 'WAITING', isUser: false },
    { token: 'C-109', status: 'WAITING', isUser: false },
    { token: 'C-110', status: 'WAITING', isUser: false },
    { token: 'C-111', status: 'WAITING', isUser: false },
    { token: 'C-112', status: 'WAITING', isUser: false },
    { token: 'C-113', status: 'WAITING', isUser: false },
    { token: 'C-114', status: 'WAITING', isUser: false },
    { token: 'C-115', status: 'WAITING', isUser: false },
    { token: 'C-116', status: 'WAITING', isUser: false },
    { token: 'C-117', status: 'WAITING', isUser: true },
    { token: 'C-118', status: 'WAITING', isUser: false },
    { token: 'C-119', status: 'WAITING', isUser: false },
    { token: 'C-120', status: 'WAITING', isUser: false },
  ],

  // Procurement Process
  procurementDetails: {
    weighbridgeSlipNo: 'WB-9921',
    grossWeightQuintals: 72.4,
    tareWeightQuintals: 7.4,
    netWeightQuintals: 65.0,
    moisturePercent: '11.8% (Allowed: <12.0%)',
    foreignMatterPercent: '0.4% (Grade A)',
    verifiedByStaff: 'Inspector S. K. Verma',
    completedAt: null,
  },

  // Payment Tracking
  paymentDetails: {
    paymentRef: 'DBT-GOV-2026-99248',
    status: 'NOT_INITIATED', // NOT_INITIATED, PROCESSING, COMPLETED
    payoutAmount: 147875,
    accountMasked: 'SBI ****8492',
    ifsc: 'SBIN0001234',
    dbtStatusText: 'Direct Benefit Transfer linked with Aadhaar NPCI mapper',
    disbursedAt: null,
  }
};

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'BOOKING_CONFIRMED',
    title: 'Slot Confirmed: Token C-117',
    message: 'Your slot at Karnal Central APMC Mandi is confirmed for 65 Qtl Wheat today. Monitor live queue remotely.',
    timestamp: '08:32 AM',
    read: false,
    channel: 'SMS & App',
  },
  {
    id: 'notif-2',
    type: 'QUEUE_UPDATE',
    title: 'Live Queue Active',
    message: 'Procurement started at Gate 2. Currently serving token C-101. Your position is #16.',
    timestamp: '09:00 AM',
    read: true,
    channel: 'App',
  },
  {
    id: 'notif-3',
    type: 'REMOTE_GUARANTEE',
    title: 'Remote Waiting Advisory',
    message: 'Remote waiting guarantee active. Please do NOT travel to the yard yet. Next alert at position #5.',
    timestamp: '09:30 AM',
    read: true,
    channel: 'WhatsApp',
  }
];
