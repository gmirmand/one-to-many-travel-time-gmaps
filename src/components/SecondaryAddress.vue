<template>
  <div class="p-4">
    <div class="mb-4">
      <label for="secondaryAddress" class="block text-sm font-medium text-gray-700">Ajouter une adresse secondaire</label>
      <input
          id="secondaryAddress"
          v-model="inputAddress"
          class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Entrez une adresse secondaire">
      <button
          @click="addSecondaryAddress"
          class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
        Ajouter
      </button>
    </div>
    <div v-for="(address, index) in locationStore.secondaryAddresses" :key="index" class="mt-4">
      <h2 class="text-lg font-medium text-gray-900">Adresse secondaire {{ index + 1 }} :</h2>
      <p class="mt-1 text-sm text-gray-600">{{ address.formatted_address }}</p>
      <button
          @click="removeSecondaryAddress(index)"
          class="ml-2 text-xs text-red-500">
        Supprimer
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useLocationStore } from '@/store/LocationStore';

export default {
  setup() {
    const locationStore = useLocationStore();
    const inputAddress = ref('');  // reactive variable for two-way binding on input

    // reactive variable for the full address object
    const fullAddress = ref(null);

    function addSecondaryAddress() {
      locationStore.addSecondaryAddress(fullAddress.value);
    }

    function removeSecondaryAddress(index) {
      locationStore.removeSecondaryAddress(index);
    }

    return {
      locationStore,
      inputAddress,
      addSecondaryAddress,
      removeSecondaryAddress,
      fullAddress
    };
  },
  mounted() {
    this.checkGoogleAndInitAutocomplete();
  },
  methods: {
    checkGoogleAndInitAutocomplete() {
      if (typeof google === 'undefined') {
        setTimeout(() => {
          this.checkGoogleAndInitAutocomplete();
        }, 100);
      } else {
        this.initializeAutocomplete();
      }
    },
    initializeAutocomplete() {
      const input = document.getElementById('secondaryAddress');
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Add listener for the place_changed event
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.formatted_address) {
          console.log('Please enter a valid address');
          return;
        }
        this.fullAddress = place;
      });
    },
  }
}
</script>

<style scoped>
/* Vous pouvez ajouter ici le style CSS spécifique à ce composant si nécessaire */
</style>
