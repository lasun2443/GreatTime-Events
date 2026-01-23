const API_URL = 'http://localhost:3001/api';

export const api = {
  auth: {
    login: async (data: any) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return response.json();
    },
    register: async (data: any) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      return response.json();
    },
  },
  halls: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/halls`);
      if (!response.ok) {
        throw new Error('Failed to fetch halls');
      }
      return response.json();
    },
    create: async (data: any, token: string) => {
      const response = await fetch(`${API_URL}/halls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create hall');
      }
      return response.json();
    },
    delete: async (id: string, token: string) => {
      const response = await fetch(`${API_URL}/halls?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete hall');
      }
      return response.json();
    },
  },
  bookings: {
    getAll: async (token: string, filters?: { status?: string; customer?: string }) => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.customer) params.append('customer', filters.customer);
      
      const response = await fetch(`${API_URL}/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return response.json();
    },
    create: async (data: any) => {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }
      return response.json();
    },
    update: async (data: any, token: string) => {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update booking');
      }
      return response.json();
    },
    delete: async (id: string, token: string) => {
      const response = await fetch(`${API_URL}/bookings?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete booking');
      }
      return response.json();
    },
  },
  payments: {
    getAll: async (filters?: { startDate?: string; endDate?: string; status?: string }) => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`${API_URL}/payments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    },
  },
  settings: {
    get: async () => {
      const response = await fetch(`${API_URL}/settings`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    },
    updateEventCenterInfo: async (data: any) => {
      const response = await fetch(`${API_URL}/settings/event-center-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event center info');
      }
      return response.json();
    },
    updateBookingSettings: async (data: any) => {
      const response = await fetch(`${API_URL}/settings/booking-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update booking settings');
      }
      return response.json();
    },
  },
  dashboard: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      return response.json();
    },
    getRecentBookings: async () => {
      const response = await fetch(`${API_URL}/dashboard/recent-bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent bookings');
      }
      return response.json();
    },
  },
};
