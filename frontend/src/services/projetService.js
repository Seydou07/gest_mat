// services/projetService.js
import api from './api';

const projetService = {
  // Récupérer tous les projets
  getAll: async () => {
    const response = await api.get('/projets');
    return response.data;
  },

  // Récupérer un projet par ID
  getById: async (id) => {
    const response = await api.get(`/projets/${id}`);
    return response.data;
  },

  // Créer un projet
  create: async (projetData) => {
    const response = await api.post('/projets', projetData);
    return response.data;
  },

  // Modifier un projet
  update: async (id, projetData) => {
    const response = await api.put(`/projets/${id}`, projetData);
    return response.data;
  },

  // Supprimer un projet
  delete: async (id) => {
    const response = await api.delete(`/projets/${id}`);
    return response.data;
  }
};

export default projetService;