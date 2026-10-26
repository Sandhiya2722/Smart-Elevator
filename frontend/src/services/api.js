import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export const getElevatorStatus = () => api.get('/api/elevator/status');
export const moveElevator = (floor) => api.post('/api/elevator/move', { floor });
export const resetElevator = () => api.post('/api/elevator/reset');
export const emergencyStop = () => api.post('/api/elevator/emergency');
export const getSensorStatus = () => api.get('/api/sensors/status');
export const getLoadSensor = () => api.get('/api/sensors/load');
export const setLoad = (load) => api.post('/api/sensors/load', { load });
export const incrementLoad = () => api.post('/api/sensors/load', { action: 'increment' });
export const decrementLoad = () => api.post('/api/sensors/load', { action: 'decrement' });
export const randomLoad = () => api.post('/api/sensors/load', { action: 'random' });
export const getTrips = () => api.get('/api/trips');
export const checkHealth = () => api.get('/api/health');

export default api;
