// services/dashboardService.js
import api from './api';

const dashboardService = {
    // Récupérer les statistiques pour le dashboard
    getStats: async () => {
        const response = await api.get('/stats');
        return response.data;
    }
};

export default dashboardService;
