"use client";

import { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  quickReplies?: string[];
  type?: 'text' | 'pricing' | 'cta';
  ctaLink?: string;
  ctaText?: string;
}

const ChatWidget = () => {
  // State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration with real values
  const API_URL = 'https://lead-gen-bot.onrender.com/api/chat';
  const API_KEY = '039d4b24647bbb106ae1e0595f3692b9e48402cddf85424f944bf0d65f499263';

  // Website packages and pricing
  const pricingOptions = [
    { name: 'Starter Website', price: 750, description: '3 pages, mobile-friendly, basic SEO' },
    { name: 'Business Pro', price: 1500, description: '5 pages, lead forms, advanced features' },
    { name: 'Elite Custom Site', price: 2500, description: 'Full branding, custom features, automation' }
  ];

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
        text: "Hey there! Welcome to Kaizen Digital. I'm your AI assistant, here to help you get an awesome website in 48 hours! 🚀", 
        isUser: false,
        quickReplies: [
          "I need a website",
          "How much does it cost?",
          "Tell me more about your services",
          "I have a question"
        ]
      }]);
    }
  }, [isChatOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Set up follow-up messages
  useEffect(() => {
    if (!lastInteraction || !email) return;
    
    // Follow up after 1 hour
    const oneHourTimeout = setTimeout(() => {
      if (!isConversionCompleted()) {
        sendFollowUpMessage("Hey! Just checking in. Do you have any questions before you get started? I'd love to help!");
      }
    }, 60 * 60 * 1000); // 1 hour
    
    // Follow up after 24 hours
    const oneDayTimeout = setTimeout(() => {
      if (!isConversionCompleted()) {
        sendFollowUpMessage("I still have a slot available for you! Let's get your website live this week. Want me to hold your spot?");
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    // Follow up after 3 days
    const threeDayTimeout = setTimeout(() => {
      if (!isConversionCompleted()) {
        sendFollowUpMessage("Last call! My current openings are filling up fast. If you want your website ready this week, now's the time to start!");
      }
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
    
    return () => {
      clearTimeout(oneHourTimeout);
      clearTimeout(oneDayTimeout);
      clearTimeout(threeDayTimeout);
    };
  }, [lastInteraction, email]);

  // Dummy function to check if user completed purchase
  const isConversionCompleted = () => {
    // In a real implementation, check if user has made a payment
    return false;
  };

  const sendFollowUpMessage = (message: string) => {
    // In a real implementation, this would send an email or notification
    console.log("Follow-up:", message);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handle quick reply selection
  const handleQuickReply = (reply: string) => {
    // Add user message
    const newMessages = [...messages, { text: reply, isUser: true }];
    setMessages(newMessages);
    setLastInteraction(new Date());
    
    // Process the reply
    setTimeout(() => {
      switch(reply) {
        case "I need a website":
          setMessages([...newMessages, {
            text: "Awesome! What type of website are you looking for?",
            isUser: false,
            quickReplies: [
              "Business Website",
              "E-commerce Store",
              "Portfolio/Personal Website",
              "Custom Project"
            ]
          }]);
          break;
          
        case "Business Website":
        case "E-commerce Store":
        case "Portfolio/Personal Website":
        case "Custom Project":
          setMessages([...newMessages, {
            text: `Great choice! I can get that ${reply.toLowerCase()} built for you in just 48 hours. Let me show you the pricing so we can get started.`,
            isUser: false,
            type: 'pricing'
          }, {
            text: "Ready to start? You can secure your spot with a $500 deposit. Click here to pay now!",
            isUser: false,
            type: 'cta',
            ctaLink: "/api/create-checkout-session",
            ctaText: "Pay Deposit Now"
          }]);
          break;
          
        case "How much does it cost?":
          setMessages([...newMessages, {
            text: "Great question! Our pricing is simple and transparent. Here's a quick breakdown:",
            isUser: false,
            type: 'pricing'
          }, {
            text: "Want to start today? Pay now and I'll guide you through the next steps!",
            isUser: false,
            type: 'cta',
            ctaLink: "/api/create-checkout-session",
            ctaText: "Pay Deposit Now"
          }]);
          break;
          
        case "Tell me more about your services":
          setMessages([...newMessages, {
            text: "We specialize in high-performance websites that help businesses grow. Here's what you get with every website:\n✅ Mobile-Optimized & Fast-Loading\n✅ SEO & Lead Generation Ready\n✅ Custom Branding & Sleek Design\n✅ Conversion-Focused Strategy",
            isUser: false
          }, {
            text: "Let's build something amazing! Ready to start? Click below to pay & get started.",
            isUser: false,
            type: 'cta',
            ctaLink: "/api/create-checkout-session",
            ctaText: "Pay Deposit Now"
          }]);
          break;
          
        case "I have a question":
          setMessages([...newMessages, {
            text: "Sure! What would you like to ask? I can help with pricing, features, timelines, or anything else.",
            isUser: false
          }, {
            text: "Drop your email here and I'll follow up with more details if you need.",
            isUser: false
          }]);
          setShowEmailInput(true);
          break;
          
        default:
          // For any other reply, use the API
          sendMessage(reply);
      }
    }, 500);
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) return;
    
    setMessages([...messages, { 
      text: `Thanks! I've saved your email (${email}). I'll follow up with more information soon!`,
      isUser: false,
      quickReplies: ["Back to main menu"]
    }]);
    setShowEmailInput(false);
    setLastInteraction(new Date());
    
    // In a real implementation, store the email in your database
    console.log("Captured lead email:", email);
  };

  const sendMessage = async (message = messageInput) => {
    if (!message.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: message, isUser: true }];
    setMessages(newMessages);
    setMessageInput('');
    setIsTyping(true);
    setLastInteraction(new Date());

    try {
      // Send request to API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          message: message,
          user_id: userId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setIsTyping(false);
      
      // Add API response
      setMessages([...newMessages, { 
        text: data.message, 
        isUser: false,
        // Add quick replies for some API responses
        quickReplies: newMessages.length % 3 === 0 ? [
          "How much does it cost?",
          "Tell me more about your services"
        ] : undefined
      }]);
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
      if (showEmailInput) {
        handleEmailSubmit();
      } else {
        sendMessage();
      }
    }
  };

  // Render pricing component
  const renderPricing = () => (
    <div className="bg-white rounded-lg p-2 mt-2 mb-4 shadow-sm">
      {pricingOptions.map((option, index) => (
        <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
          <div className="font-bold text-gray-800">{option.name} – ${option.price}</div>
          <div className="text-sm text-gray-600">{option.description}</div>
        </div>
      ))}
    </div>
  );

  // Render CTA button
  const renderCTA = (ctaLink: string, ctaText: string) => (
    <a 
      href={ctaLink}
      className="inline-block bg-[#4a6cf7] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors duration-200"
    >
      {ctaText}
    </a>
  );

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
              <div key={index}>
                <div 
                  className={`mb-2.5 p-2.5 rounded-[15px] max-w-[80%] break-words ${
                    message.isUser 
                      ? 'bg-[#e6f2ff] text-gray-800 ml-auto rounded-br-[4px]' 
                      : 'bg-[#4a6cf7] text-white mr-auto rounded-bl-[4px]'
                  }`}
                >
                  {message.text}
                </div>
                
                {/* Render pricing if message type is pricing */}
                {!message.isUser && message.type === 'pricing' && renderPricing()}
                
                {/* Render CTA button if message type is cta */}
                {!message.isUser && message.type === 'cta' && message.ctaLink && message.ctaText && 
                  renderCTA(message.ctaLink, message.ctaText)
                }
                
                {/* Render quick replies */}
                {!message.isUser && message.quickReplies && message.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 mt-1">
                    {message.quickReplies.map((reply, replyIndex) => (
                      <button
                        key={replyIndex}
                        onClick={() => handleQuickReply(reply)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
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
            {showEmailInput ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Your email address..."
                  className="flex-1 p-2.5 border border-[#ddd] rounded-l-[20px] outline-none"
                />
                <button 
                  onClick={handleEmailSubmit}
                  className="bg-[#4a6cf7] text-white border-none px-4 rounded-r-[20px] ml-0 cursor-pointer"
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-2.5 border border-[#ddd] rounded-[20px] outline-none"
                />
                <button 
                  onClick={() => sendMessage()}
                  className="bg-[#4a6cf7] text-white border-none w-10 h-10 rounded-full ml-2.5 cursor-pointer flex justify-center items-center"
                >
                  ➤
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 