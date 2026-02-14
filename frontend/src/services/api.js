const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/app';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.msg || data.msj || 'Error en la petición');
  }
  
  return data;
};

// ==================== AUTH ====================
export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ==================== INVITATIONS ====================
export const invitationService = {
  // Admin - Crear invitación
  create: async (invitationData) => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/invitacion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(invitationData),
    });
    return handleResponse(response);
  },

  // Admin - Obtener todas las invitaciones
  getAll: async () => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/invitacion`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Admin - Obtener una invitación
  getById: async (id) => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/invitacion/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Admin - Eliminar invitación
  delete: async (id) => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/invitacion/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Público - Ver invitación
  getPublic: async (id) => {
    const response = await fetch(`${API_URL}/public/${id}`);
    return handleResponse(response);
  },

  // Público - Confirmar asistencia
  confirm: async (id) => {
    const response = await fetch(`${API_URL}/public/${id}/confirm`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },
};