import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eco_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const getGoogleLoginUrl = () => `${API_BASE}/auth/google`;
export const getDiscordLoginUrl = () => `${API_BASE}/auth/discord`;

// ── Users ─────────────────────────────────────────────
export const getMe = () => api.get('/users/me').then(r => r.data);
export const updateWallet = (walletAddress: string) =>
  api.put('/users/me/wallet', { walletAddress }).then(r => r.data);

// ── Trees ─────────────────────────────────────────────
export const getAllTrees = () => api.get('/trees').then(r => r.data);
export const getMyTrees = () => api.get('/trees/my').then(r => r.data);
export const getTreeStats = () => api.get('/trees/stats').then(r => r.data);
export const plantTree = (data: {
  latitude: number;
  longitude: number;
  locationName?: string;
  ngoPartner?: string;
}) => api.post('/trees', data).then(r => r.data);

// ── Blockchain ────────────────────────────────────────
export const getTokenBalance = (wallet: string) =>
  api.get('/blockchain/balance', { params: { wallet } }).then(r => r.data);

export default api;
