import api from './axios';

// Each function returns just the useful slice of the { success, data } envelope.

export const registerRequest = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data; // { token, user }
};

export const loginRequest = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data; // { token, user }
};

export const meRequest = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user; // { id, name, email, avatarColor }
};
