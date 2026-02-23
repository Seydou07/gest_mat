// services/marqueService.js
import api from './api';

const marqueService = {
  // Récupérer toutes les marques
  getAll: async () => {
    const response = await api.get('/config/marques');
    return response.data;
  },

  // Récupérer une marque par ID
  getById: async (id) => {
    const response = await api.get(`/config/marques/${id}`);
    return response.data;
  },

  // Créer une marque
  create: async (marqueData) => {
    const response = await api.post('/config/marques', marqueData);
    return response.data;
  },

  // Modifier une marque
  update: async (id, marqueData) => {
    const response = await api.put(`/config/marques/${id}`, marqueData);
    return response.data;
  },

  // Supprimer une marque
  delete: async (id) => {
    const response = await api.delete(`/config/marques/${id}`);
    return response.data;
  }
};

export default marqueService;