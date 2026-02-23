// services/historiqueService.js
import api from './api';

const historiqueService = {
  // Récupérer tout l'historique
  getAll: async () => {
    const response = await api.get('/historique');
    // Le backend renvoie {data: [...]} donc on retourne response.data.data
    return response.data.data || response.data;
  },

  // Récupérer l'historique par type
  getByType: async (type) => {
    const response = await api.get(`/historique/type/${type}`);
    return response.data;
  },

  // Récupérer l'historique par date
  getByDate: async (date) => {
    const response = await api.get(`/historique/date/${date}`);
    return response.data;
  },

  // Récupérer l'historique par utilisateur
  getByUser: async (userId) => {
    const response = await api.get(`/historique/utilisateur/${userId}`);
    return response.data;
  },

  // Récupérer l'historique par entité (agent, matériel, projet...)
  getByEntity: async (entityType, entityId) => {
    const response = await api.get(`/historique/entite/${entityType}/${entityId}`);
    return response.data;
  },

  // Exporter l'historique
  export: async (format = 'csv') => {
    const response = await api.get(`/historique/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default historiqueService;