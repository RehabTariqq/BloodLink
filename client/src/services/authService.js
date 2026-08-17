import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('bloodlink_token', response.data.token);
    localStorage.setItem('bloodlink_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('bloodlink_token', response.data.token);
    localStorage.setItem('bloodlink_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('bloodlink_token');
  localStorage.removeItem('bloodlink_user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('bloodlink_user');
  return user ? JSON.parse(user) : null;
};

const verifyPassword = async (password) => {
  const response = await api.post('/auth/verify-password', { password });
  return response.data;
};

export default { register, login, logout, getCurrentUser, verifyPassword };