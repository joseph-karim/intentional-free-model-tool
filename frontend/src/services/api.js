import axios from 'axios';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('API Request Error:', error.request);
    } else {
      // Error setting up request
      console.error('API Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * API Service for communication with the backend
 */
const apiService = {
  /**
   * Get quiz questions
   * @returns {Promise<Array>} Array of quiz questions
   */
  getQuestions: async () => {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
  
  /**
   * Submit quiz answers
   * @param {Object} answers - Quiz answers
   * @returns {Promise<Object>} Analysis results
   */
  submitQuiz: async (answers) => {
    try {
      const response = await api.post('/submit', { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },
  
  /**
   * Analyze form data
   * @param {Object} formData - Form data to analyze
   * @returns {Promise<Object>} Analysis results
   */
  analyzeModel: async (formData) => {
    try {
      const response = await api.post('/analyze', { form_data: formData });
      return response.data;
    } catch (error) {
      console.error('Error analyzing model:', error);
      throw error;
    }
  },
  
  /**
   * Create a shareable analysis link
   * @param {Object} formData - Form data to analyze and share
   * @returns {Promise<Object>} Shared analysis ID
   */
  createSharedAnalysis: async (formData) => {
    try {
      const response = await api.post('/analyze/share', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating shared analysis:', error);
      throw error;
    }
  },
  
  /**
   * Get a shared analysis by ID
   * @param {string} shareId - Shared analysis ID
   * @returns {Promise<Object>} Analysis results
   */
  getSharedAnalysis: async (shareId) => {
    try {
      const response = await api.get(`/analyze/${shareId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shared analysis:', error);
      throw error;
    }
  },
  
  /**
   * Get example inputs
   * @returns {Promise<Array>} Array of example inputs
   */
  getExamples: async () => {
    try {
      const response = await api.get('/examples');
      return response.data;
    } catch (error) {
      console.error('Error fetching examples:', error);
      throw error;
    }
  },
  
  /**
   * Send chat message
   * @param {string} message - User message
   * @param {Object} context - Optional context
   * @returns {Promise<Object>} Chat response
   */
  sendChatMessage: async (message, context = null) => {
    try {
      const response = await api.post('/chat', { message, context });
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }
};

export default apiService; 