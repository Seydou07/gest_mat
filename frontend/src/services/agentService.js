// services/agentService.js
import api from './api';

const agentService = {
  // Récupérer tous les agents
  getAll: async () => {
    const response = await api.get('/agents'); 
    return response.data;
  },

  // Récupérer un agent par ID
  getById: async (id) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },

  // Créer un agent
  create: async (agentData) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },

  // Modifier un agent
  update: async (id, agentData) => {
    const response = await api.put(`/agents/${id}`, agentData);
    return response.data;
  },

  // Supprimer un agent
  delete: async (id) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  },

  // Récupérer les fonctions (depuis /api/config/fonctions)
  getFonctions: async () => {
    const response = await api.get('/config/fonctions');
    return response.data;
  }
};

export default agentService;