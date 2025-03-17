"use client";

import { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  quickReplies?: string[];
  type?: 'text' | 'pricing' | 'cta' | 'payment-options';
  ctaLink?: string;
  ctaText?: string;
  packageType?: string;
  packagePrice?: number;
}

interface PaymentOption {
  id: string;
  type: 'deposit' | 'full';
  amount: number;
  title: string;
  description: string;
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
  const [selectedPackage, setSelectedPackage] = useState<{type: string, price: number} | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<{deposit: string, full: string} | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'deposit_paid' | 'full_paid'>('none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration with real values
  const API_URL = 'https://lead-gen-bot.onrender.com/api/chat';
  const API_KEY = '039d4b24647bbb106ae1e0595f3692b9e48402cddf85424f944bf0d65f499263';
  const PAYMENT_API_URL = '/api/payment-options'; // Endpoint to be created

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
    
    // Check if user has existing payment status
    checkPaymentStatus(storedUserId);
  }, []);

  // Check payment status from backend
  const checkPaymentStatus = async (userId: string) => {
    try {
      const response = await fetch(`${PAYMENT_API_URL}/status?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentStatus(data.status || 'none');
        
        // If payment was made, update UI accordingly
        if (data.status === 'deposit_paid' || data.status === 'full_paid') {
          showPostPaymentMessages(data.status);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  // Show appropriate messages after payment
  const showPostPaymentMessages = (status: string) => {
    if (status === 'deposit_paid') {
      setMessages([{
        text: "Thanks for your deposit! I've sent the intake form to your email. To complete your website project, please fill it out as soon as possible.",
        isUser: false,
        quickReplies: ["I need help with the form", "When do I pay the rest?"]
      }]);
    } else if (status === 'full_paid') {
      setMessages([{
        text: "Thank you for your payment! Your project is now prioritized for completion within 48 hours. I've sent the intake form to your email - please fill it out as soon as possible so we can get started right away!",
        isUser: false,
        quickReplies: ["I need help with the form", "What happens next?"]
      }]);
    }
  };

  // Add welcome message when chat is opened for the first time
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      // Show different message based on payment status
      if (paymentStatus === 'none') {
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
      } else {
        showPostPaymentMessages(paymentStatus);
      }
    }
  }, [isChatOpen, messages.length, paymentStatus]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Set up follow-up messages
  useEffect(() => {
    if (!lastInteraction || paymentStatus !== 'none') return;
    
    // Follow up after 1 hour
    const oneHourTimeout = setTimeout(() => {
      sendFollowUpMessage("Hey! Just checking in. Do you have any questions before you get started? I'd love to help!");
    }, 60 * 60 * 1000); // 1 hour
    
    // Follow up after 24 hours
    const oneDayTimeout = setTimeout(() => {
      sendFollowUpMessage("I still have a slot available for you! Let's get your website live this week. Want me to hold your spot?");
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    // Follow up after 3 days
    const threeDayTimeout = setTimeout(() => {
      sendFollowUpMessage("Last call! My current openings are filling up fast. If you want your website ready this week, now's the time to start!");
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
    
    return () => {
      clearTimeout(oneHourTimeout);
      clearTimeout(oneDayTimeout);
      clearTimeout(threeDayTimeout);
    };
  }, [lastInteraction, paymentStatus]);

  // Set up deposit payment reminder if deposit was paid
  useEffect(() => {
    if (paymentStatus !== 'deposit_paid') return;
    
    // Remind after 3 days
    const reminderTimeout = setTimeout(() => {
      sendFollowUpMessage("Just a friendly reminder about your website project! To complete the process, you'll need to pay the remaining balance before we can launch your site. Let me know if you need the payment link again!");
    }, 3 * 24 * 60 * 60 * 1000); // 3 days
    
    return () => {
      clearTimeout(reminderTimeout);
    };
  }, [paymentStatus]);

  const sendFollowUpMessage = (message: string) => {
    // In a real implementation, this would send an email or notification
    console.log("Follow-up:", message);
    
    // Also store in database for future reference
    storeLeadInteraction(userId, 'follow_up', { message });
  };

  // Store interactions in database
  const storeLeadInteraction = async (userId: string, type: string, data: any) => {
    try {
      await fetch(`${PAYMENT_API_URL}/interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error storing interaction:', error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Generate payment links for a specific package
  const generatePaymentLinks = async (packageType: string, packagePrice: number) => {
    setIsTyping(true);
    try {
      const response = await fetch(`${PAYMENT_API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email: email || null,
          packageType,
          packagePrice,
          depositAmount: 500
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate payment links');
      }
      
      const data = await response.json();
      setPaymentLinks(data.links);
      
      // Show payment options
      const newMessages = [...messages, {
        text: "Great! I have two payment options for you:",
        isUser: false,
        type: 'payment-options' as const,
        packageType,
        packagePrice
      }];
      
      setMessages(newMessages);
      setSelectedPackage({ type: packageType, price: packagePrice });
      
    } catch (error) {
      console.error('Error generating payment links:', error);
      setMessages([...messages, {
        text: "I'm having trouble generating payment options right now. Could you try again in a moment?",
        isUser: false
      }]);
    }
    setIsTyping(false);
  };

  // Process payment selection
  const handlePaymentOptionSelect = async (optionType: 'deposit' | 'full') => {
    if (!paymentLinks) return;
    
    const paymentUrl = optionType === 'deposit' ? paymentLinks.deposit : paymentLinks.full;
    
    // Record selection
    storeLeadInteraction(userId, 'payment_selection', {
      optionType,
      packageType: selectedPackage?.type,
      packagePrice: selectedPackage?.price
    });
    
    // Add message showing selection
    setMessages([...messages, {
      text: optionType === 'deposit' 
        ? "I'd like to pay the $500 deposit" 
        : "I'd like to pay the full amount",
      isUser: true
    }, {
      text: optionType === 'deposit'
        ? "Great! I'm redirecting you to our secure payment page to make your $500 deposit. After payment, I'll send you the intake form to gather all the details for your website."
        : "Excellent choice! I'm redirecting you to our secure payment page to make your full payment. This will prioritize your project for completion within 48 hours. After payment, I'll send you the intake form.",
      isUser: false,
      type: 'cta',
      ctaLink: paymentUrl,
      ctaText: optionType === 'deposit' ? "Pay $500 Deposit" : `Pay Full Amount ($${selectedPackage?.price})`
    }]);
  };

  // Handle quick reply selection
  const handleQuickReply = (reply: string) => {
    // Add user message
    const newMessages = [...messages, { text: reply, isUser: true }];
    setMessages(newMessages);
    setLastInteraction(new Date());
    
    // Store interaction
    storeLeadInteraction(userId, 'quick_reply', { reply });
    
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
          let packagePrice = 1500; // Default to Business Pro
          if (reply === "Business Website") packagePrice = 1500;
          else if (reply === "E-commerce Store") packagePrice = 2500;
          else if (reply === "Portfolio/Personal Website") packagePrice = 750;
          else if (reply === "Custom Project") packagePrice = 2500;
          
          setMessages([...newMessages, {
            text: `Great choice! I can get that ${reply.toLowerCase()} built for you in just 48 hours. Let me show you the pricing so we can get started.`,
            isUser: false,
            type: 'pricing'
          }]);
          
          // Ask for email if we don't have it yet
          if (!email) {
            setMessages(prev => [...prev, {
              text: "To provide you with payment options, could you please share your email address?",
              isUser: false
            }]);
            setShowEmailInput(true);
          } else {
            // Generate payment links if we already have email
            generatePaymentLinks(reply, packagePrice);
          }
          break;
          
        case "How much does it cost?":
          setMessages([...newMessages, {
            text: "Great question! Our pricing is simple and transparent. Here's a quick breakdown:",
            isUser: false,
            type: 'pricing'
          }, {
            text: "Which package are you interested in?",
            isUser: false,
            quickReplies: [
              "Starter Website",
              "Business Pro",
              "Elite Custom Site"
            ]
          }]);
          break;
          
        case "Starter Website":
          generatePaymentLinks("Starter Website", 750);
          break;
          
        case "Business Pro":
          generatePaymentLinks("Business Pro", 1500);
          break;
          
        case "Elite Custom Site":
          generatePaymentLinks("Elite Custom Site", 2500);
          break;
          
        case "Tell me more about your services":
          setMessages([...newMessages, {
            text: "We specialize in high-performance websites that help businesses grow. Here's what you get with every website:\n✅ Mobile-Optimized & Fast-Loading\n✅ SEO & Lead Generation Ready\n✅ Custom Branding & Sleek Design\n✅ Conversion-Focused Strategy",
            isUser: false
          }, {
            text: "Would you like to see our pricing options?",
            isUser: false,
            quickReplies: [
              "Show me pricing",
              "I have a question"
            ]
          }]);
          break;
          
        case "Show me pricing":
          setMessages([...newMessages, {
            text: "Here's our simple and transparent pricing:",
            isUser: false,
            type: 'pricing'
          }, {
            text: "Which package are you interested in?",
            isUser: false,
            quickReplies: [
              "Starter Website",
              "Business Pro",
              "Elite Custom Site"
            ]
          }]);
          break;
          
        case "I have a question":
          setMessages([...newMessages, {
            text: "Sure! What would you like to ask? I can help with pricing, features, timelines, or anything else.",
            isUser: false,
            quickReplies: [
              "Book a consultation",
              "Show me pricing"
            ]
          }, {
            text: "Drop your email here and I'll follow up with more details if you need.",
            isUser: false
          }]);
          setShowEmailInput(true);
          break;
          
        case "I need help with the form":
          setMessages([...newMessages, {
            text: "No problem! The intake form helps us gather all the details we need to build your website. If you're having trouble with any questions, feel free to respond with 'as discussed' for now, and we'll follow up to clarify those points. Is there a specific section you need help with?",
            isUser: false,
            quickReplies: [
              "Content questions",
              "Design preferences",
              "Technical questions"
            ]
          }]);
          break;
          
        case "When do I pay the rest?":
          setMessages([...newMessages, {
            text: "The remaining balance will be due before we launch your website. We'll send you a reminder with a payment link about 3 days before your scheduled launch date. You'll have a chance to review the site before making the final payment.",
            isUser: false,
            quickReplies: [
              "What happens next?",
              "I need help with the form"
            ]
          }]);
          break;
          
        case "What happens next?":
          setMessages([...newMessages, {
            text: "Here's what happens next:\n1️⃣ Complete the intake form I emailed you\n2️⃣ Our design team will review your information\n3️⃣ We'll create your website in 48 hours\n4️⃣ You'll receive a preview link to review\n5️⃣ After your approval, we'll launch your site!",
            isUser: false,
            quickReplies: [
              "How long until launch?",
              "I need help with the form"
            ]
          }]);
          break;
          
        case "Back to main menu":
          setMessages([...newMessages, {
            text: "What would you like to know about?",
            isUser: false,
            quickReplies: [
              "I need a website",
              "How much does it cost?",
              "Tell me more about your services",
              "I have a question"
            ]
          }]);
          break;
          
        case "Book a consultation":
          setMessages([...newMessages, {
            text: "Great! If you'd like to speak with one of our web experts, you can book a free 10-minute consultation to discuss your project in detail.",
            isUser: false,
            type: 'cta',
            ctaLink: "https://calendly.com/kaizen-digital/free-consultation",
            ctaText: "Book a Free Consultation"
          }]);
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
      text: `Thanks ${email}! Now I can provide you with personalized options.`,
      isUser: false
    }]);
    setShowEmailInput(false);
    setLastInteraction(new Date());
    
    // Store the email
    storeLeadInteraction(userId, 'email_capture', { email });
    
    // If we have a selected package, generate payment links
    if (selectedPackage) {
      generatePaymentLinks(selectedPackage.type, selectedPackage.price);
    } else {
      // Otherwise continue the conversation
      setMessages(prev => [...prev, {
        text: "What type of website are you looking for?",
        isUser: false,
        quickReplies: [
          "Business Website",
          "E-commerce Store",
          "Portfolio/Personal Website",
          "Custom Project"
        ]
      }]);
    }
  };

  const sendMessage = async (message = messageInput) => {
    if (!message.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: message, isUser: true }];
    setMessages(newMessages);
    setMessageInput('');
    setIsTyping(true);
    setLastInteraction(new Date());
    
    // Store the message
    storeLeadInteraction(userId, 'message', { message });

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

  // Render payment options
  const renderPaymentOptions = (packageType: string, packagePrice: number) => {
    const paymentOptions: PaymentOption[] = [
      {
        id: 'deposit',
        type: 'deposit',
        amount: 500,
        title: 'Deposit Option',
        description: `Pay $500 now to secure your spot, then the remaining $${packagePrice - 500} before launch.`
      },
      {
        id: 'full',
        type: 'full',
        amount: packagePrice,
        title: 'Full Payment',
        description: `Pay the full $${packagePrice} now for priority service and faster completion.`
      }
    ];
    
    return (
      <div className="bg-white rounded-lg p-3 mt-2 mb-4 shadow-sm">
        {paymentOptions.map((option) => (
          <div 
            key={option.id}
            className="mb-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => handlePaymentOptionSelect(option.type)}
          >
            <div className="font-bold text-gray-800">{option.title}</div>
            <div className="text-sm text-gray-600 mb-2">{option.description}</div>
            <div className="text-[#4a6cf7] font-semibold">
              {option.type === 'deposit' ? `$${option.amount} now` : `$${option.amount} one-time payment`}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render CTA button
  const renderCTA = (ctaLink: string, ctaText: string) => (
    <a 
      href={ctaLink}
      className="inline-block bg-[#4a6cf7] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
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
                
                {/* Render payment options if message type is payment-options */}
                {!message.isUser && message.type === 'payment-options' && 
                  message.packageType && message.packagePrice && 
                  renderPaymentOptions(message.packageType, message.packagePrice)
                }
                
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