<template>
  <div id="app">
    <div class="flex justify-center sm:items-start sm:flex-row flex-col sm:space-x-4 space-x-0 sm:space-y-0 space-y-4">
      <MainAddress />
      <SecondaryAddress />
    </div>
    <DistanceCalculator />
  </div>
</template>

<script>
import MainAddress from '@/components/MainAddress.vue'
import SecondaryAddress from '@/components/SecondaryAddress.vue'
import DistanceCalculator from "@/components/DistanceCalculator.vue";

export default {
  components: {
    DistanceCalculator,
    MainAddress,
    SecondaryAddress,
  },
  mounted() {
    // apiKey from .env.local file (VUE_APP_GOOGLE_API_KEY)
    const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;
    // Load the Places Autocomplete library
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  },
}
</script>
