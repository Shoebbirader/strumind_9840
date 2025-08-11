import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/me', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
};

// Projects API
export const projectsAPI = {
  getAllProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  duplicateProject: (id) => api.post(`/projects/${id}/duplicate`),
  addCollaborator: (id, userData) => api.post(`/projects/${id}/collaborators`, userData),
  removeCollaborator: (projectId, userId) => api.delete(`/projects/${projectId}/collaborators/${userId}`)
};

// Models API
export const modelsAPI = {
  getModel: (projectId) => api.get(`/models/${projectId}`),
  updateModel: (projectId, modelData) => api.put(`/models/${projectId}`, modelData),
  addNode: (projectId, nodeData) => api.post(`/models/${projectId}/nodes`, nodeData),
  addBeam: (projectId, beamData) => api.post(`/models/${projectId}/beams`, beamData),
  addPlate: (projectId, plateData) => api.post(`/models/${projectId}/plates`, plateData),
  addMaterial: (projectId, materialData) => api.post(`/models/${projectId}/materials`, materialData),
  addSection: (projectId, sectionData) => api.post(`/models/${projectId}/sections`, sectionData),
  addLoadCase: (projectId, loadCaseData) => api.post(`/models/${projectId}/loadCases`, loadCaseData),
  addLoadCombination: (projectId, loadCombinationData) => api.post(`/models/${projectId}/loadCombinations`, loadCombinationData),
  addNodeLoad: (projectId, nodeId, loadData) => api.post(`/models/${projectId}/nodes/${nodeId}/loads`, loadData),
  deleteElement: (projectId, elementType, elementId) => api.delete(`/models/${projectId}/${elementType}/${elementId}`)
};

// Analysis API
export const analysisAPI = {
  getConfigurations: (projectId) => api.get(`/analysis/configurations/${projectId}`),
  createConfiguration: (projectId, configData) => api.post(`/analysis/configurations/${projectId}`, configData),
  updateConfiguration: (configId, configData) => api.put(`/analysis/configurations/${configId}`, configData),
  deleteConfiguration: (configId) => api.delete(`/analysis/configurations/${configId}`),
  runAnalysis: (configId) => api.post(`/analysis/run/${configId}`),
  getResults: (projectId) => api.get(`/analysis/results/${projectId}`),
  getResultById: (resultId) => api.get(`/analysis/results/detail/${resultId}`),
  deleteResult: (resultId) => api.delete(`/analysis/results/${resultId}`)
};

// Results API
export const resultsAPI = {
  getDisplacements: (resultId, loadCase) => api.get(`/results/${resultId}/displacements`, { params: { loadCase } }),
  getReactions: (resultId, loadCase) => api.get(`/results/${resultId}/reactions`, { params: { loadCase } }),
  getBeamForces: (resultId, loadCase, beamId) => api.get(`/results/${resultId}/beam-forces`, { params: { loadCase, beamId } }),
  getBeamStresses: (resultId, loadCase, beamId) => api.get(`/results/${resultId}/beam-stresses`, { params: { loadCase, beamId } }),
  getPlateForces: (resultId, loadCase, plateId) => api.get(`/results/${resultId}/plate-forces`, { params: { loadCase, plateId } }),
  getPlateStresses: (resultId, loadCase, plateId) => api.get(`/results/${resultId}/plate-stresses`, { params: { loadCase, plateId } }),
  getModalResults: (resultId, modeNumber) => api.get(`/results/${resultId}/modal`, { params: { modeNumber } }),
  getResultSummary: (resultId) => api.get(`/results/${resultId}/summary`),
  exportResults: (resultId, format, resultType, loadCase) => api.get(`/results/${resultId}/export`, { 
    params: { format, resultType, loadCase },
    responseType: format === 'csv' ? 'blob' : 'json'
  })
};

// Settings API
export const settingsAPI = {
  getUserSettings: () => api.get('/settings/user'),
  updateUserSettings: (settingsData) => api.put('/settings/user', settingsData),
  getProjectSettings: (projectId) => api.get(`/settings/project/${projectId}`),
  updateProjectSettings: (projectId, settingsData) => api.put(`/settings/project/${projectId}`, settingsData),
  getDesignCodes: () => api.get('/settings/design-codes')
};

export default api;