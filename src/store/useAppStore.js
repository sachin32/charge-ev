import { create } from "zustand";

export const useAppStore = create((set) => ({
  location: null,
  selectedState: "",
  selectedCity: "",
  searchQuery: "",
  referenceData: null,

  setLocation: (location) => set({ location }),
  setSelectedState: (selectedState) => set({ selectedState }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setReferenceData: (referenceData) => set({ referenceData }),
  clearLocation: () => set({ location: null }),
}));
