import api from '../api/axios';
import type { Paiement } from '../types';

export const paymentsService = {
    getAll: async (): Promise<Paiement[]> => {
        const response = await api.get('/api/paiements/');
        return response.data;
    }
};
