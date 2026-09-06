import { create } from 'zustand';
import { MOCK_CENTRES } from '../utils/mockData';

// Initial Government MSP Rates per quintal (Kharif/Rabi 2026)
const INITIAL_MSP_RATES = {
  RAGI: 4290,
  PADDY_GRADE_A: 2320,
  PADDY_COMMON: 2300,
  MAIZE: 2225,
  TUR: 7550,
  GRAM: 5440,
};

export const useAdminStore = create((set) => ({
  mspRates: INITIAL_MSP_RATES,
  centres: MOCK_CENTRES,
  isLoadBalancerActive: false,

  /** Update MSP rate for a crop key */
  updateMspRate: (cropKey, newRate) => {
    set((state) => ({
      mspRates: {
        ...state.mspRates,
        [cropKey]: Number(newRate),
      },
    }));
  },

  /** Update daily capacity (Quintals) for a specific centre */
  updateCentreCapacity: (centreId, newCapacity) => {
    set((state) => ({
      centres: state.centres.map((c) =>
        c.id === centreId ? { ...c, dailyCapacityQuintals: Number(newCapacity) } : c
      ),
    }));
  },

  /** Update active weighbridge scales for a centre */
  updateActiveCounters: (centreId, newCounters) => {
    set((state) => ({
      centres: state.centres.map((c) =>
        c.id === centreId ? { ...c, activeCounters: Number(newCounters) } : c
      ),
    }));
  },

  /** Toggle dynamic load balancing across cluster yards */
  toggleLoadBalancer: () => {
    set((state) => {
      const nextState = !state.isLoadBalancerActive;
      const updatedCentres = state.centres.map((c) => {
        if (nextState && c.id === 'C002') {
          return { ...c, recommended: true, recommendationReason: 'Auto Load Balanced: Shifted 30% traffic from Bandipalya!' };
        }
        return c;
      });
      return {
        isLoadBalancerActive: nextState,
        centres: updatedCentres,
      };
    });
  },

  /** Reset all MSP rates and centre capacities to defaults */
  resetDefaults: () => {
    set({
      mspRates: INITIAL_MSP_RATES,
      centres: MOCK_CENTRES,
      isLoadBalancerActive: false,
    });
  },
}));
