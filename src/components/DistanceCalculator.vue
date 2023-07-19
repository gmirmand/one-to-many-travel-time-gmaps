<!-- src/components/DistanceCalculator.vue -->
<template>
  <div class="p-4 border-t border-gray-200">
    <h2 class="text-lg font-medium text-gray-900">Distances</h2>

    <div v-if="locationStore.mainAddress && locationStore.secondaryAddresses.length > 0">
      <h3 class="mt-4 text-sm font-medium text-gray-700">De : {{ locationStore.mainAddress.formatted_address }}</h3>
      <ul class="mt-2 space-y-2 flex items-center flex-col">
        <li v-for="(address, index) in locationStore.secondaryAddresses" :key="index" class="mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-900 font-bold">Vers : {{ address.name }}
                <a
                    :href="address.url" class="text-xs font-normal" rel="noopener noreferrer"
                    target="_blank">🔗&nbsp;({{ address.formatted_address }})</a>
              </p>

                <p v-if="getDistance(address, 'walking')" :class="colorByTime(getDistance(address, 'walking').duration?.value)" class="mt-1 text-sm">
                  À pied : {{ getDistance(address, 'walking').duration ? `${getDistance(address, 'walking').duration.text} (${getDistance(address, 'walking').distance.text})` : 'Trajet impossible' }}
                </p>
                <p v-else class="mt-1 text-sm text-gray-600">Calcul en cours...</p>
                <p v-if="getDistance(address, 'driving')" :class="colorByTime(getDistance(address, 'driving').duration?.value)" class="mt-1 text-sm">
                  En voiture : {{ getDistance(address, 'driving').duration ? `${getDistance(address, 'driving').duration.text} (${getDistance(address, 'driving').distance.text})` : 'Trajet impossible' }}
                </p>
                <p v-else class="mt-1 text-sm text-gray-600">Calcul en cours...</p>
                <p v-if="getDistance(address, 'transit')" :class="colorByTime(getDistance(address, 'transit').duration?.value)" class="mt-1 text-sm">
                  En transport : {{ getDistance(address, 'transit').duration ? `${getDistance(address, 'transit').duration.text} (${getDistance(address, 'transit').distance.text})` : 'Trajet impossible' }}
                </p>
                <p v-else class="mt-1 text-sm text-gray-600">Calcul en cours...</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else>
      <p class="mt-4 text-sm text-gray-600">Ajoutez une adresse secondaire pour calculer les distances.</p>
    </div>
  </div>
</template>

<script>
import {onMounted, ref, watch} from 'vue';
import {useLocationStore} from '@/store/locationStore';

export default {
  setup() {
    const locationStore = useLocationStore();
    const distances = ref({});

    onMounted(() => {
      checkGoogleAndCalculateDistances();
    });

    // on lance le calcul des distances à chaque fois que l'adresse principale ou les adresses secondaires changent
    // secondaryAddresses est un tableau, on doit donc vérifier chaque élément du tableau, deep: true
    watch([() => locationStore.mainAddress, () => locationStore.secondaryAddresses], () => {
      // on vérifie si c'est un ajout ou une suppression d'adresse secondaire
      if (Object.keys(distances.value).length > locationStore.secondaryAddresses.length) {
        // suppression
        const index = Object.keys(distances.value).find((index) => !locationStore.secondaryAddresses[index]);
        delete distances.value[index];
      } else {
        // ajout
        checkGoogleAndCalculateDistances();
      }
    }, { deep: true });

    function checkGoogleAndCalculateDistances() {
      if (typeof google === 'undefined') {
        setTimeout(checkGoogleAndCalculateDistances, 100);
      } else {
        calculateDistances();
      }
    }

    function calculateDistances() {
      const service = new google.maps.DistanceMatrixService();

      locationStore.secondaryAddresses
          .forEach((secondaryAddress) => {
            ['DRIVING', 'WALKING', 'TRANSIT']
                .forEach((mode) => {
                  if(!locationStore.getDistance(locationStore.mainAddress.reference, secondaryAddress.reference, mode.toLowerCase())) {
                    console.info(`%c Calcul de la distance ${locationStore.mainAddress.formatted_address} vers ${secondaryAddress.formatted_address} en ${mode.toLowerCase()}`, 'color: #9c27b0');

                    service.getDistanceMatrix({
                      origins: [locationStore.mainAddress.formatted_address],
                      destinations: [secondaryAddress.formatted_address],
                      travelMode: mode,
                    }, (response, status) => {
                      if (status === 'OK') {
                        locationStore.addDistance(locationStore.mainAddress.reference, secondaryAddress.reference, mode.toLowerCase(), {
                          duration: response.rows[0].elements[0]?.duration,
                          distance: response.rows[0].elements[0]?.distance,
                        });
                      }
                    });
                  } else {
                    console.info(`%c Distance ${locationStore.mainAddress.formatted_address} vers ${secondaryAddress.formatted_address} en ${mode.toLowerCase()} déjà calculée`, 'color: #4caf50');
                  }
                });
          });
    }

    function getDistance(address, mode) {
      return locationStore.getDistance(locationStore.mainAddress.reference, address.reference, mode);
    }

    function colorByTime(duration) {
      const minutes = duration / 60;
      if(!duration) {
        return 'text-gray-600';
      } else if (minutes <= 15) {
        return 'text-green-500';
      } else if (minutes <= 30) {
        return 'text-yellow-600';
      } else if (minutes <= 45) {
        return 'text-orange-500';
      } else {
        return 'text-red-500';
      }
    }

    return {
      locationStore,
      distances,
      getDistance,
      colorByTime,
    };
  },
};
</script>

<style scoped>
/* Vous pouvez ajouter ici le style CSS spécifique à ce composant si nécessaire */
</style>
