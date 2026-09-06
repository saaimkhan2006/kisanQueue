import { MOCK_INITIAL_BOOKINGS } from '../utils/mockData';

// localStorage key for the full list of bookings
const BOOKINGS_KEY = 'kisanqueue_bookings';
// localStorage key for which booking is currently "active" in the queue monitor
const ACTIVE_ID_KEY = 'kisanqueue_active_booking_id';

// ---------- helpers ----------

function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      // Seed with initial Mysore bookings on first load
      saveBookings(MOCK_INITIAL_BOOKINGS);
      return MOCK_INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_INITIAL_BOOKINGS;
  }
}

function saveBookings(list) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    // Ignore write error
  }
}

// Centre default configurations for Mysore cluster
const CENTRE_DEFAULTS = {
  C001: {
    commuteMinutes: 20,
    commuteDistanceKm: 7.8,
    routeDesc: 'Via Nanjangud Road (Tractor Speed)',
    gate: 'Gate 2 (Tractor Entry)',
    currentlyServing: 'MY-110',
    tokenPrefix: 'MY',
  },
  C002: {
    commuteMinutes: 36,
    commuteDistanceKm: 16.4,
    routeDesc: 'Via NH-766 (Nanjangud Highway)',
    gate: 'Main Gate 1',
    currentlyServing: 'NJ-039',
    tokenPrefix: 'NJ',
  },
  C003: {
    commuteMinutes: 48,
    commuteDistanceKm: 24.0,
    routeDesc: 'Via Kollegal Main Road',
    gate: 'East Gate',
    currentlyServing: 'TN-015',
    tokenPrefix: 'TN',
  },
  C004: {
    commuteMinutes: 60,
    commuteDistanceKm: 38.0,
    routeDesc: 'Via Old Mysore-Bantwal Road',
    gate: 'Gate 3',
    currentlyServing: 'HN-072',
    tokenPrefix: 'HN',
  },
};

// ---------- service ----------

export const bookingService = {
  /** Return all active/pending bookings newest-first */
  async getAllBookings() {
    await new Promise((r) => setTimeout(r, 100));
    return loadBookings();
  },

  /** Return the booking currently selected as "active" for the queue monitor, or null */
  async getMyActiveBooking() {
    await new Promise((r) => setTimeout(r, 100));
    const bookings = loadBookings();
    if (!bookings.length) return null;

    const activeId = localStorage.getItem(ACTIVE_ID_KEY);
    if (activeId) {
      const found = bookings.find((b) => b.bookingId === activeId);
      if (found) return found;
    }
    // Fall back to the first available booking
    return bookings[0] ?? null;
  },

  /** Set which booking is shown in the live queue monitor */
  setActiveBookingId(bookingId) {
    if (bookingId) {
      localStorage.setItem(ACTIVE_ID_KEY, bookingId);
    } else {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  },

  async createBooking(bookingPayload) {
    await new Promise((r) => setTimeout(r, 300));

    const centreDefaults = CENTRE_DEFAULTS[bookingPayload.centreId] || CENTRE_DEFAULTS.C001;
    const randomTokenNum = Math.floor(120 + Math.random() * 30);
    const token = `${centreDefaults.tokenPrefix}-${randomTokenNum}`;
    const bookingId = `KQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const estimatedWaitMinutes = 45;
    const newBooking = {
      bookingId,
      token,
      centreId: bookingPayload.centreId || 'C001',
      centreName: bookingPayload.centreName || 'Mysore (Bandipalya) APMC Central Yard',
      gate: bookingPayload.gate || centreDefaults.gate,
      produceType: bookingPayload.produceType || 'RAGI',
      cropName: bookingPayload.cropName || 'Ragi (Finger Millet)',
      quantityQuintals: bookingPayload.quantityQuintals || 50,
      mspRatePerQuintal: bookingPayload.mspRatePerQuintal || 4290,
      estimatedTotalAmount: bookingPayload.estimatedTotalAmount || (50 * 4290),
      slotDate: bookingPayload.slotDate || new Date().toISOString().slice(0, 10),
      slotTime: bookingPayload.slotTime || '10:00 AM - 12:00 PM',
      status: 'WAITING',
      createdAt: new Date().toISOString(),

      // Real-time queue telemetry
      initialPosition: 11,
      currentPosition: 11,
      farmersAhead: 10,
      estimatedWaitMinutes,
      currentlyServing: centreDefaults.currentlyServing,

      // Departure planning
      commuteMinutes: centreDefaults.commuteMinutes,
      commuteDistanceKm: centreDefaults.commuteDistanceKm,
      routeDesc: centreDefaults.routeDesc,
      expectedTurnTime: new Date(Date.now() + estimatedWaitMinutes * 60 * 1000).toISOString(),
      recommendedDepartureTime: new Date(
        Date.now() + Math.max(0, estimatedWaitMinutes - centreDefaults.commuteMinutes) * 60 * 1000
      ).toISOString(),

      // Visual token queue
      queueTokens: [
        { token: centreDefaults.currentlyServing, status: 'SERVING', isUser: false },
        ...Array.from({ length: 9 }, (_, i) => ({
          token: `${centreDefaults.tokenPrefix}-${parseInt(centreDefaults.currentlyServing.replace(/\D/g, '')) + 1 + i}`,
          status: 'WAITING',
          isUser: false,
        })),
        { token, status: 'WAITING', isUser: true },
        { token: `${centreDefaults.tokenPrefix}-${randomTokenNum + 1}`, status: 'WAITING', isUser: false },
      ],

      // Procurement and payment
      procurementDetails: {
        weighbridgeSlipNo: null,
        grossWeightQuintals: null,
        tareWeightQuintals: null,
        netWeightQuintals: null,
        moisturePercent: null,
        foreignMatterPercent: null,
        verifiedByStaff: null,
        completedAt: null,
      },
      paymentDetails: {
        paymentRef: null,
        status: 'NOT_INITIATED',
        payoutAmount: bookingPayload.estimatedTotalAmount || (50 * 4290),
        accountMasked: 'Canara Bank ****8492',
        ifsc: 'CNRB0001234',
        dbtStatusText: 'Direct Benefit Transfer linked with Aadhaar NPCI mapper',
        disbursedAt: null,
      },
    };

    // Prepend to list (newest first) and set as active
    const existing = loadBookings();
    saveBookings([newBooking, ...existing]);
    localStorage.setItem(ACTIVE_ID_KEY, bookingId);

    return newBooking;
  },

  async cancelBooking(bookingId) {
    await new Promise((r) => setTimeout(r, 200));
    const existing = loadBookings();
    const updated = existing.filter((b) => b.bookingId !== bookingId);
    saveBookings(updated);

    // If cancelled one was active, promote next booking or clear
    const activeId = localStorage.getItem(ACTIVE_ID_KEY);
    if (activeId === bookingId) {
      if (updated.length > 0) {
        localStorage.setItem(ACTIVE_ID_KEY, updated[0].bookingId);
      } else {
        localStorage.removeItem(ACTIVE_ID_KEY);
      }
    }
    return { success: true, bookingId };
  },

  /** Persist an in-place update to a booking (e.g. after delay-pass or position advance) */
  updateBookingInPlace(updatedBooking) {
    const existing = loadBookings();
    const idx = existing.findIndex((b) => b.bookingId === updatedBooking.bookingId);
    if (idx !== -1) {
      existing[idx] = updatedBooking;
      saveBookings(existing);
    }
  },

  /** Update only the status field of a booking */
  updateBookingStatus(bookingId, status, extraFields = {}) {
    const existing = loadBookings();
    const idx = existing.findIndex((b) => b.bookingId === bookingId);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], status, ...extraFields };
      saveBookings(existing);
      return existing[idx];
    }
    return null;
  },

  /** Farmer taps "I've Arrived" — marks booking as ARRIVED */
  async markArrived(bookingId) {
    await new Promise((r) => setTimeout(r, 200));
    return this.updateBookingStatus(bookingId, 'ARRIVED', {
      arrivedAt: new Date().toISOString(),
    });
  },

  /** Staff calls farmer to counter */
  async callToCounter(bookingId) {
    await new Promise((r) => setTimeout(r, 150));
    return this.updateBookingStatus(bookingId, 'PROCESSING', {
      calledAt: new Date().toISOString(),
    });
  },

  /** Staff completes procurement — finalises the booking */
  async completeProcurement(bookingId, procurementData) {
    await new Promise((r) => setTimeout(r, 300));
    return this.updateBookingStatus(bookingId, 'PROCURED', {
      procurementDetails: procurementData,
      completedAt: new Date().toISOString(),
    });
  },

  /** Staff rejects/cancels from their side */
  async rejectBooking(bookingId, reason) {
    await new Promise((r) => setTimeout(r, 200));
    return this.updateBookingStatus(bookingId, 'REJECTED', {
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
    });
  },

  /** Reset bookings to initial Mysore demo set */
  clearAll() {
    saveBookings(MOCK_INITIAL_BOOKINGS);
    localStorage.setItem(ACTIVE_ID_KEY, MOCK_INITIAL_BOOKINGS[0].bookingId);
  },
};

