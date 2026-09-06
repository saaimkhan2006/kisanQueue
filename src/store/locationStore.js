import { create } from 'zustand';

const LOCATION_KEY = 'kisanqueue_user_location';

const DEFAULT_LOCATION = {
  city: 'Mysore',
  district: 'Mysore',
  state: 'Karnataka',
};

function getStoredLocation() {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

export const useLocationStore = create((set) => ({
  location: getStoredLocation(),
  isEditing: false,

  setIsEditing: (isEditing) => set({ isEditing }),

  updateLocation: (city, district = city, state = 'Karnataka') => {
    const newLocation = {
      city: city.trim() || 'Mysore',
      district: district.trim() || city.trim() || 'Mysore',
      state: state.trim() || 'Karnataka',
    };
    try {
      localStorage.setItem(LOCATION_KEY, JSON.stringify(newLocation));
    } catch {
      // Ignore write error
    }
    set({ location: newLocation, isEditing: false });
  },

  resetLocation: () => {
    try {
      localStorage.removeItem(LOCATION_KEY);
    } catch {
      // Ignore
    }
    set({ location: DEFAULT_LOCATION, isEditing: false });
  },
}));
