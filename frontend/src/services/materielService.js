// services/materielService.js
import api from './api';

const materielService = {
  // Récupérer tous les matériels
  getAll: async () => {
    const response = await api.get('/materiels');
    return response.data;
  },

  // Récupérer un matériel par ID
  getById: async (id) => {
    const response = await api.get(`/materiels/${id}`);
    return response.data;
  },

  // Créer un matériel
  create: async (materielData) => {
    const response = await api.post('/materiels', materielData);
    return response.data;
  },

  // Modifier un matériel
  update: async (id, materielData) => {
    const response = await api.put(`/materiels/${id}`, materielData);
    return response.data;
  },

  // Supprimer un matériel
  delete: async (id) => {
    const response = await api.delete(`/materiels/${id}`);
    return response.data;
  },

  // Récupérer les types de matériel
  getTypes: async () => {
    const response = await api.get('/config/types-materiel');
    return response.data;
  },

  // Récupérer les états
  getEtats: async () => {
    const response = await api.get('/config/etats-materiel');
    return response.data;
  },

  // Récupérer les localisations
  getLocalisations: async () => {
    const response = await api.get('/config/localisations');
    return response.data;
  },

  // Récupérer les marques
  getMarques: async () => {
    const response = await api.get('/config/marques');
    return response.data;
  },

  // Récupérer les projets
  getProjets: async () => {
    const response = await api.get('/projets');
    return response.data;
  }
};

export default materielService;