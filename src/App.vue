<template>
  <div id="app">
    <header class="p-4 bg-blue-500 text-white mb-4">
      <h1 class="text-xl font-bold">Calculateur de Temps de Trajet avec Google Maps</h1>
      <p class="mt-2 text-sm">
        Bonjour et bienvenue! Ici, vous pouvez entrer une adresse principale et plusieurs adresses secondaires. L'application vous montrera alors le temps de trajet entre l'adresse principale et chacune des adresses secondaires, que ce soit à pied, en voiture ou en transport en commun. C'est un excellent outil pour les personnes qui cherchent un nouvel appartement et veulent vérifier rapidement si le lieu est bien situé par rapport à leurs points d'intérêt habituels. Allez-y, essayez!
      </p>
    </header>

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
