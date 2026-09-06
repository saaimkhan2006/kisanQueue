import { create } from 'zustand';
import { bookingService } from '../services/bookingService';
import { queueService } from '../services/queueService';
import { calculateDepartureTime } from '../utils/timeUtils';

export const useQueueStore = create((set, get) => ({
  liveQueue: null,
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

  fetchLiveQueue: async () => {
    set({ isLoading: true });
    try {
      const data = await queueService.getLiveQueue();
      set({ liveQueue: data, isLoading: false });
      return data;
    } catch (err) {
      set({ isLoading: false });
    }
  },

  /**
   * DEMO STORY ACTION:
   * Simulates staff calling next token at Mandi counter.
   * Decrements position from #12 -> #11 -> ... -> #5 (APPROACHING) -> #1 (CALLED)
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
    const tokenNum = parseInt(liveQueue.currentlyServing.replace('C-', '')) + 1;
    const nextServing = `C-${tokenNum}`;

    const newExpectedTurn = new Date(Date.now() + nextWait * 60 * 1000).toISOString();
    const newDeparture = calculateDepartureTime(newExpectedTurn, liveQueue.commuteMinutes).toISOString();

    // Update tokens status
    const updatedTokens = (liveQueue.queueTokens || []).map((item) => {
      if (item.token === nextServing) {
        return { ...item, status: 'SERVING' };
      }
      if (parseInt(item.token.replace('C-', '')) < tokenNum) {
        return { ...item, status: 'COMPLETED' };
      }
      return item;
    });

    let alert = null;
    if (nextPos === 5) {
      alert = {
        type: 'APPROACHING',
        title: '⚠️ Turn Approaching!',
        message: 'Your token C-117 is now #5 in queue! Please depart for Mandi Gate 2 immediately.',
      };
      showToast('Position #5 reached! Start traveling to Mandi Gate 2 now.', 'directions_car');
    } else if (nextPos === 1) {
      alert = {
        type: 'CALLED',
        title: '🚨 YOUR TOKEN IS CALLED!',
        message: 'Token C-117 called to Weighbridge Counter 04! Gate entry guaranteed.',
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

    set({ liveQueue: updatedQueue, notificationAlert: alert });
  },

  requestDelayPass: async (minutes = 15) => {
    const { showToast } = get();
    try {
      const updated = await queueService.requestDelayPass(minutes);
      showToast(`Grace Extension Granted: Sequence moved to #${updated.currentPosition} (+15 min window)`, 'schedule');
      get().fetchLiveQueue();
    } catch (err) {
      showToast('Unable to request delay pass.', 'error');
    }
  },

  resetQueueToInitial: async () => {
    const { showToast } = get();
    localStorage.removeItem('kisanqueue_active_booking');
    await get().fetchLiveQueue();
    set({ notificationAlert: null });
    showToast('Queue state reset to initial Position #12 for demo.', 'restart_alt');
  }
}));
