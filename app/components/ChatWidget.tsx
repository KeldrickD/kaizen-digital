"use client";

import { useState, useEffect, useRef } from 'react';

const ChatWidget = () => {
  // State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration with real values
  const API_URL = 'https://lead-gen-bot.onrender.com/api/chat';
  const API_KEY = '039d4b24647bbb106ae1e0595f3692b9e48402cddf85424f944bf0d65f499263';

  // Initialize user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem('chat_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chat_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Add welcome message when chat is opened for the first time
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{ 
        text: "Hello! I'm your web development assistant. How can I help you today?", 
        isUser: false 
      }]);
    }
  }, [isChatOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: messageInput, isUser: true }];
    setMessages(newMessages);
    setMessageInput('');
    setIsTyping(true);

    try {
      // Send request to API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          message: messageInput,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsTyping(false);
      setMessages([...newMessages, { text: data.message, isUser: false }]);
    } catch (error) {
      setIsTyping(false);
      setMessages([
        ...newMessages, 
        { text: 'Sorry, I encountered an error. Please try again later.', isUser: false }
      ]);
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      {!isChatOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-5 right-5 w-15 h-15 bg-[#4a6cf7] text-white rounded-full p-4 shadow-lg z-50 text-2xl flex items-center justify-center"
        >
          💬
        </button>
      )}

      {/* Chat container */}
      {isChatOpen && (
        <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden z-50 font-sans">
          <div className="p-4 bg-[#4a6cf7] text-white font-bold flex justify-between items-center">
            <span>Chat with us</span>
            <span onClick={toggleChat} className="cursor-pointer">✖</span>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-2.5 p-2.5 rounded-[15px] max-w-[80%] break-words ${
                  message.isUser 
                    ? 'bg-[#e6f2ff] text-gray-800 ml-auto rounded-br-[4px]' 
                    : 'bg-[#4a6cf7] text-white mr-auto rounded-bl-[4px]'
                }`}
              >
                {message.text}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex p-2.5 mb-2.5 bg-[#4a6cf7] rounded-[15px] rounded-bl-[4px] mr-auto max-w-[80px]">
                <span className="h-2.5 w-2.5 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="h-2.5 w-2.5 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2.5 w-2.5 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex p-2.5 border-t border-[#e0e0e0]">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2.5 border border-[#ddd] rounded-[20px] outline-none"
            />
            <button 
              onClick={sendMessage}
              className="bg-[#4a6cf7] text-white border-none w-10 h-10 rounded-full ml-2.5 cursor-pointer flex justify-center items-center"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 