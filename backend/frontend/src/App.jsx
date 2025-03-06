import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AnalyzerPage from './pages/AnalyzerPage';
import ResultsPage from './pages/ResultsPage';
import ChatPage from './pages/ChatPage';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/results/:resultId" element={<ResultsPage />} />
            <Route path="/chat/:sessionId" element={<ChatPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App; 