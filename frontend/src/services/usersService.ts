import api from '../api/axios';
import type { User } from '../types';

export const usersService = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get('/api/utilisateurs/');
        return response.data;
    }
};
