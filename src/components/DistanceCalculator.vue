<!-- src/components/DistanceCalculator.vue -->
<template>
  <div class="p-4 border-t border-gray-200">
    <h2 class="text-lg font-medium text-gray-900">Distances</h2>
    <div v-if="locationStore.mainAddress && locationStore.secondaryAddresses.length > 0">
      <h3 class="mt-4 text-sm font-medium text-gray-700">De : {{ locationStore.mainAddress.formatted_address }}</h3>
      <ul class="mt-2 space-y-2 flex items-center flex-col">
        <li class="mb-4" v-for="(distance, index) in distances" :key="index">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-900 font-bold">Vers : {{ distance.address.formatted_address }}</p>
              <p class="mt-1 text-sm text-gray-600">À pied : {{ distance.walking || 'Calcul en cours...' }}</p>
              <p class="mt-1 text-sm text-gray-600">En voiture : {{
                  distance.driving || 'Calcul en cours...'
                }}</p>
              <p class="mt-1 text-sm text-gray-600">En transport : {{
                  distance.transit || 'Calcul en cours...'
                }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--    no secondary addresses -->
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
    }, {deep: true});

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
          .forEach((secondaryAddress, index) => {
            // add adress destination in distances
            distances.value = {
              ...distances.value,
              [index]: {
                address: secondaryAddress,
              },
            };
            ['DRIVING', 'WALKING', 'TRANSIT']
                .forEach((mode) => {
              service.getDistanceMatrix({
                origins: [locationStore.mainAddress.formatted_address],
                destinations: [secondaryAddress.formatted_address],
                travelMode: mode,
              }, (response, status) => {
                if (status === 'OK') {
                  distances.value = {
                    ...distances.value,
                    [index]: {
                      ...distances.value[index],
                      [mode.toLowerCase()]: `${response.rows[0].elements[0].duration.text} (${response.rows[0].elements[0].distance.text})`,
                    },
                  };
                }
              });
            });
          });
    }

    return {
      locationStore,
      distances,
    };
  },
};
</script>

<style scoped>
/* Vous pouvez ajouter ici le style CSS spécifique à ce composant si nécessaire */
</style>
