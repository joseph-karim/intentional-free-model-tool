import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import { FormProvider } from './context/FormContext';

/**
 * Main App component
 * 
 * Configures routing and global state providers for the application
 */
function App() {
  return (
    <Router>
      <FormProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/share/:shareId" element={<ResultsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </FormProvider>
    </Router>
  );
}

export default App; 