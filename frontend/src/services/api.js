import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:8000';

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch quiz questions
export const fetchQuestions = async () => {
  try {
    const response = await apiClient.get('/api/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Function to submit quiz answers
export const submitQuiz = async (answers) => {
  try {
    const response = await apiClient.post('/api/submit', { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

export default {
  fetchQuestions,
  submitQuiz,
}; 