// src/store/locationStore.js
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', {
  id: 'location',
  // Le state initial du store
  state: () => ({
    mainAddress: null,
    secondaryAddresses: [],
  }),
  // Les getters pour le store
  getters: {
    numberOfSecondaryAddresses(state) {
      return state.secondaryAddresses.length;
    },
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
  }
})
