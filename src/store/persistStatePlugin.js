// src/store/persistStatePlugin.js
import { watch } from 'vue';

export function persistStatePlugin({ store }) {
  // Lors de la création du store, chargez l'état précédemment enregistré dans localStorage, si disponible
  const savedState = localStorage.getItem(store.$id);
  if (savedState) {
    store.$patch(JSON.parse(savedState));
  }

  // Surveillez les modifications de l'état du store et les enregistrez dans localStorage
  watch(store.$state, (newState) => {
    localStorage.setItem(store.$id, JSON.stringify(newState));
  }, { deep: true });
}
