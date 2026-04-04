import api from '@/lib/api';
import { Task, PaginatedTasks, TaskFilters } from '@/types';

export const tasksService = {
  getAll: async (filters: TaskFilters = {}): Promise<PaginatedTasks> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    const { data } = await api.get(`/tasks?${params.toString()}`);
    return data;
  },

  getOne: async (id: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  create: async (payload: Partial<Task>): Promise<Task> => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Task>): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggle: async (id: string): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}/toggle`);
    return data;
  },
};
