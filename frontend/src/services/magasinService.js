// services/magasinService.js
// "Magasins" correspond en réalité aux Localisations dans le backend
import api from './api';

const magasinService = {
  // Récupérer toutes les localisations
  getAll: async () => {
    const response = await api.get('/config/localisations');
    return response.data;
  },

  // Récupérer une localisation par ID
  getById: async (id) => {
    const response = await api.get(`/config/localisations/${id}`);
    return response.data;
  },

  // Créer une localisation
  create: async (data) => {
    const response = await api.post('/config/localisations', data);
    return response.data;
  },

  // Modifier une localisation
  update: async (id, data) => {
    const response = await api.put(`/config/localisations/${id}`, data);
    return response.data;
  },

  // Supprimer une localisation
  delete: async (id) => {
    const response = await api.delete(`/config/localisations/${id}`);
    return response.data;
  }
};

export default magasinService;