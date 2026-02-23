// services/pvService.js
import api from './api';

const pvService = {
  // Récupérer tous les PV
  getAll: async () => {
    const response = await api.get('/pv');
    return response.data;
  },

  // Récupérer un PV par ID
  getById: async (id) => {
    const response = await api.get(`/pv/${id}`);
    return response.data;
  },

  // Créer un PV
  create: async (pvData) => {
    // Pour l'upload de fichier, utiliser FormData
    const formData = new FormData();
    Object.keys(pvData).forEach(key => {
      if (key === 'fichier' && pvData[key] instanceof File) {
        formData.append('fichier', pvData[key]);
      } else if (key === 'agents_presents' && Array.isArray(pvData[key])) {
        formData.append('agents_presents', JSON.stringify(pvData[key]));
      } else {
        formData.append(key, pvData[key]);
      }
    });

    const response = await api.post('/pv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Modifier un PV
  update: async (id, pvData) => {
    const response = await api.put(`/pv/${id}`, pvData);
    return response.data;
  },

  // Supprimer un PV
  delete: async (id) => {
    const response = await api.delete(`/pv/${id}`);
    return response.data;
  },

  // Télécharger le fichier d'un PV
  downloadFile: async (id) => {
    const response = await api.get(`/pv/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Récupérer les agents pour la sélection
  getAgents: async () => {
    const response = await api.get('/agents');
    return response.data;
  },

  // Récupérer les projets (marchés)
  getMarches: async () => {
    const response = await api.get('/projets');
    return response.data;
  }
};

export default pvService;