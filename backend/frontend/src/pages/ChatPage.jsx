import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ChatPage() {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Fetch the chat session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`/api/chat/sessions/${sessionId}`);
        setSession(response.data);
        setMessages(response.data.messages || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat session:', error);
        setError('Failed to load chat session. Please try again.');
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      
      // Optimistically add the user message
      setMessages(prev => [...prev, {
        user_message: newMessage,
        assistant_message: '...',
        created_at: new Date().toISOString()
      }]);
      
      setNewMessage('');
      
      // Send to API
      const response = await axios.post(`/api/chat/sessions/${sessionId}/messages`, {
        user_message: newMessage
      });
      
      // Update with the real response
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = response.data;
        return updated;
      });
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update the placeholder message with an error
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          assistant_message: 'Sorry, there was an error processing your message. Please try again.'
        };
        return updated;
      });
      
      setSending(false);
    }
  };
  
  // Suggested questions that the user can ask
  const suggestedQuestions = [
    "How can I improve my desirability score?",
    "What are the most important actions to take right now?",
    "Should I change my free model type?",
    "How can I better convert free users to paid?",
    "What metrics should I track to measure success?"
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <Link to="/analyzer" className="btn-primary mt-4 inline-block">
          Go Back to Analyzer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">AI Assistant Chat</h1>
        {session && session.quiz_result_id && (
          <Link 
            to={`/results/${session.quiz_result_id}`}
            className="btn-secondary"
          >
            Back to Results
          </Link>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">
        Ask me follow-up questions about your free model analysis. I can provide more detailed insights and recommendations based on your specific needs.
      </p>
      
      {/* Chat Messages */}
      <div className="bg-white rounded-lg shadow-md flex-grow overflow-hidden flex flex-col">
        <div className="p-4 overflow-y-auto flex-grow">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              <p className="mb-4">No messages yet. Start by asking a question.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left p-2 bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => setNewMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {/* User message */}
                  <div className="flex justify-end mb-2">
                    <div className="bg-indigo-100 rounded-lg py-2 px-4 max-w-xs md:max-w-md">
                      <p className="text-gray-900">{message.user_message}</p>
                    </div>
                  </div>
                  
                  {/* Assistant message */}
                  <div className="flex mb-2">
                    <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-xs md:max-w-md">
                      <p className="text-gray-900">
                        {message.assistant_message === '...' ? (
                          <span className="flex items-center">
                            <span className="animate-pulse">Thinking</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                          </span>
                        ) : (
                          message.assistant_message
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your question here..."
              className="form-input flex-grow"
              disabled={sending}
            />
            <button
              type="submit"
              className="btn-primary ml-2"
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending
                </span>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage; 