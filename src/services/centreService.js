import { MOCK_CENTRES } from '../utils/mockData';
import { calculateTotalExpectedTime } from '../utils/timeUtils';

export const centreService = {
  async getCentres(cropFilter = null) {
    await new Promise((r) => setTimeout(r, 250));
    
    let list = MOCK_CENTRES.map((c) => {
      const totalExpected = calculateTotalExpectedTime(
        c.travelTimeMinutes,
        c.estimatedWaitMinutes,
        c.processingTimeMinutes
      );
      return {
        ...c,
        totalExpectedMinutes: totalExpected,
      };
    });

    if (cropFilter) {
      list = list.filter((c) => c.acceptedCrops.includes(cropFilter));
    }

    // Sort by lowest total turnaround time (Smart Recommendation)
    const sorted = [...list].sort((a, b) => a.totalExpectedMinutes - b.totalExpectedMinutes);
    const lowestId = sorted[0]?.id;

    return list.map((c) => ({
      ...c,
      recommended: c.id === lowestId,
      recommendationReason:
        c.id === lowestId
          ? `Recommended: Lowest total time (${Math.floor(c.totalExpectedMinutes / 60)}h ${c.totalExpectedMinutes % 60}m) based on travel + live queue + counter processing.`
          : null,
    }));
  },

  async getCentreById(id) {
    await new Promise((r) => setTimeout(r, 200));
    const centre = MOCK_CENTRES.find((c) => c.id === id) || MOCK_CENTRES[0];
    const totalExpected = calculateTotalExpectedTime(
      centre.travelTimeMinutes,
      centre.estimatedWaitMinutes,
      centre.processingTimeMinutes
    );
    return {
      ...centre,
      totalExpectedMinutes: totalExpected,
    };
  }
};
