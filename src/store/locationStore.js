// src/store/locationStore.js
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  id: 'location',
  // Le state initial du store
  state: () => ({
    mainAddress: null,
    secondaryAddresses: [],
    distances: {},
  }),
  // Les getters pour le store
  getters: {
    numberOfSecondaryAddresses(state) {
      return state.secondaryAddresses.length;
    },
    getDistance: (state) => (from, to, mode) => {
      return state.distances[`${from}-${to}-${mode}`];
    }
  },
  // Les actions pour le store
  actions: {
    setMainAddress(address) {
      this.mainAddress = address;
    },
    addSecondaryAddress(address) {
      this.secondaryAddresses.push(address);
    },
    removeSecondaryAddress(index) {
      this.secondaryAddresses.splice(index, 1);
    },
    clearAllAddresses() {
      this.mainAddress = null;
      this.secondaryAddresses = [];
    },
    addDistance(from, to, mode, distance) {
      this.distances[`${from}-${to}-${mode}`] = distance;
    },
  },
})
