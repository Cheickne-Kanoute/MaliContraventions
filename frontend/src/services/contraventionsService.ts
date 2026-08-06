import api from '../api/axios';
import type { Contravention, GPSLocation } from '../types';

export const contraventionsService = {
    getAll: async (): Promise<Contravention[]> => {
        const response = await api.get('/api/contraventions/');
        return response.data;
    },
    
    getById: async (id: number): Promise<Contravention> => {
        const response = await api.get(`/api/contraventions/${id}/`);
        return response.data;
    },

    getGeoloc: async (): Promise<GPSLocation[]> => {
        const response = await api.get('/api/contraventions/geoloc/');
        return response.data.locations || [];
    }
};
