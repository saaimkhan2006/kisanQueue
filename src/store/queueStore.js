import { create } from 'zustand';
import { bookingService } from '../services/bookingService';
import { queueService } from '../services/queueService';
import { calculateDepartureTime } from '../utils/timeUtils';

export const useQueueStore = create((set, get) => ({
  liveQueue: null,
  allQueues: [],
  isLoading: false,
  notificationAlert: null, // { type: 'APPROACHING' | 'CALLED', message: string }
  toast: null, // { message: string, type: string }

  showToast: (message, type = 'check_circle') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3500);
  },

  clearToast: () => set({ toast: null }),

  fetchLiveQueue: async (bookingId = null) => {
    set({ isLoading: true });
    try {
      const [data, all] = await Promise.all([
        queueService.getLiveQueue(bookingId),
        queueService.getAllActiveQueues(),
      ]);
      set({ liveQueue: data, allQueues: all, isLoading: false });
      return data;
    } catch {
      set({ isLoading: false });
    }
  },

  switchActiveQueue: async (bookingId) => {
    bookingService.setActiveBookingId(bookingId);
    return get().fetchLiveQueue(bookingId);
  },

  /**
   * DEMO STORY ACTION:
   * Simulates staff calling next token at Mandi counter.
   * Decrements position from current -> ... -> #5 (APPROACHING) -> #1 (CALLED)
   */
  simulateStaffNextToken: () => {
    const { liveQueue, showToast } = get();
    if (!liveQueue) return;

    const currentPos = liveQueue.position;
    if (currentPos <= 1) {
      showToast('You are already at the counter! Token is being processed.', 'info');
      return;
    }

    const nextPos = currentPos - 1;
    const nextWait = Math.max(0, liveQueue.estimatedWaitMinutes - 4);

    // Increment currently serving token
    const match = liveQueue.currentlyServing.match(/^([A-Za-z]+-)(\d+)$/);
    let nextServing;
    let tokenNum = 1;
    if (match) {
      tokenNum = parseInt(match[2], 10) + 1;
      nextServing = `${match[1]}${String(tokenNum).padStart(match[2].length, '0')}`;
    } else {
      nextServing = `T-${Date.now().toString().slice(-3)}`;
    }

    const newExpectedTurn = new Date(Date.now() + nextWait * 60 * 1000).toISOString();
    const newDeparture = calculateDepartureTime(newExpectedTurn, liveQueue.commuteMinutes).toISOString();

    // Update tokens status
    const updatedTokens = (liveQueue.queueTokens || []).map((item) => {
      if (item.token === nextServing) {
        return { ...item, status: 'SERVING' };
      }
      const itemMatch = item.token.match(/\d+$/);
      if (itemMatch && parseInt(itemMatch[0], 10) < tokenNum) {
        return { ...item, status: 'COMPLETED' };
      }
      return item;
    });

    let alert = null;
    if (nextPos === 5) {
      alert = {
        type: 'APPROACHING',
        title: 'Turn Approaching!',
        message: `Your token ${liveQueue.token} is now #5 in queue! Please depart for ${liveQueue.gate} immediately.`,
      };
      showToast(`Position #5 reached! Start traveling to ${liveQueue.gate} now.`, 'directions_car');
    } else if (nextPos === 1) {
      alert = {
        type: 'CALLED',
        title: 'YOUR TOKEN IS CALLED!',
        message: `Token ${liveQueue.token} called to Weighbridge Counter 04! Gate entry guaranteed.`,
      };
      showToast('YOUR TOKEN IS CALLED! Proceed to Counter 04.', 'priority_high');
    } else {
      showToast(`Mandi IoT Sync: Token ${nextServing} is now serving. You are #${nextPos}.`, 'sync');
    }

    const updatedQueue = {
      ...liveQueue,
      position: nextPos,
      farmersAhead: nextPos - 1,
      estimatedWaitMinutes: nextWait,
      currentlyServing: nextServing,
      expectedTurnTime: newExpectedTurn,
      recommendedDepartureTime: newDeparture,
      queueTokens: updatedTokens,
      lastSync: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };

    // Persist the advanced position back into the bookings list
    if (liveQueue.bookingId) {
      bookingService.updateBookingInPlace({
        ...updatedQueue,
        currentPosition: nextPos,
        farmersAhead: nextPos - 1,
      });
    }

    // Also update allQueues list
    const updatedAll = get().allQueues.map((q) =>
      q.bookingId === liveQueue.bookingId ? updatedQueue : q
    );

    set({ liveQueue: updatedQueue, allQueues: updatedAll, notificationAlert: alert });
  },

  requestDelayPass: async (minutes = 15) => {
    const { showToast, liveQueue } = get();
    try {
      const updated = await queueService.requestDelayPass(minutes, liveQueue?.bookingId);
      showToast(`Grace Extension Granted: Sequence moved to #${updated.position} (+15 min window)`, 'schedule');
      await get().fetchLiveQueue(liveQueue?.bookingId);
    } catch {
      showToast('Unable to request delay pass.', 'error');
    }
  },

  resetQueueToInitial: async () => {
    const { showToast } = get();
    bookingService.clearAll();
    await get().fetchLiveQueue();
    showToast('Demo reset: Initial Mysore queues restored.', 'restart_alt');
  },
}));
