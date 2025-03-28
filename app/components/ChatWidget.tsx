"use client";

import { useState, useEffect, useRef } from 'react';
import { FaRegPaperPlane, FaTimes, FaComment, FaRegClock } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quickReplies' | 'pricing' | 'email' | 'phone';
  quickReplies?: string[];
  pricing?: {
    tier: string;
    price: string;
    features: string[];
    cta: string;
  }[];
}

interface PaymentOption {
  id: string;
  type: 'deposit' | 'full';
  amount: number;
  title: string;
  description: string;
}

// New interface for lead qualification data
interface QualificationData {
  hasWebsite: boolean | null;
  mainGoal: string | null;
  timeline: string | null;
  budget: string | null;
  industry: string | null;
  qualified: boolean;
}

const ChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [userId, setUserId] = useState('');
  const [hasScheduledFollowUp, setHasScheduledFollowUp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New state for lead qualification
  const [qualificationData, setQualificationData] = useState<QualificationData>({
    hasWebsite: null,
    mainGoal: null,
    timeline: null,
    budget: null,
    industry: null,
    qualified: false
  });
  
  // New state for phone input and communication preference
  const [phone, setPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [preferredChannel, setPreferredChannel] = useState<'email' | 'whatsapp' | 'sms' | null>(null);

  // Configuration with real values
  const API_URL = 'https://lead-gen-bot.onrender.com/api/chat';
  const API_KEY = '039d4b24647bbb106ae1e0595f3692b9e48402cddf85424f944bf0d65f499263';
  const PAYMENT_API_URL = '/api/payment-options'; // Endpoint to be created
  const TWILIO_API_URL = '/api/messaging'; // New endpoint for messaging

  // Website packages and pricing
  const pricingOptions = [
    { name: 'Starter Website', price: 750, description: '3 pages, mobile-friendly, basic SEO' },
    { name: 'Business Pro', price: 1500, description: '5 pages, lead forms, advanced features' },
    { name: 'Elite Custom Site', price: 2500, description: 'Full branding, custom features, automation' }
  ];

  // Replace the initialMessages array with a proper reference to the handleSendMessage function
  const initialMessages = [
    {
      id: '1',
      content: "Are you a real estate agent looking to upgrade your website?",
      role: 'assistant' as const,
      options: [
        {
          id: 'yes-leads',
          label: '🏡 Yes, I want more leads',
          action: () => handleSendMessage('Yes, I need a website that can help me generate more real estate leads'),
        },
        {
          id: 'yes-listings',
          label: '🧰 I want to show listings online',
          action: () => handleSendMessage('I need a website where I can showcase my property listings'),
        },
        {
          id: 'book-call',
          label: '📅 I\'d like to book a call',
          action: () => handleSendMessage('I\'d like to schedule a consultation about my real estate website needs'),
        },
        {
          id: 'not-realtor',
          label: 'I\'m not a real estate agent',
          action: () => handleSendMessage('I\'m not a real estate agent, but I\'m interested in website services'),
        },
      ],
    },
  ];

  useEffect(() => {
    // Generate a unique user ID on first load
    if (!userId) {
      const newUserId = uuidv4();
      setUserId(newUserId);
      
      // Store the user ID in local storage
      localStorage.setItem('kaizen_chat_user_id', newUserId);
    }
    
    // Check if we should start with the widget open
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('chat') === 'open') {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Add initial greeting when chat is opened
    if (isOpen && messages.length === 0) {
      // Send initial greeting with quick replies
      setTimeout(() => {
        setMessages([
          {
            id: uuidv4(),
            text: "👋 Hi there! I'm the Kaizen Digital assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: [
              "I have a question",
              "Show me pricing",
              "Book a consultation"
            ]
          }
        ]);
      }, 500);
    }
  }, [isOpen]);

  // Validate email
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);
  
  // Store lead data when qualification data changes
  useEffect(() => {
    if (userId && (qualificationData.hasWebsite !== null || qualificationData.mainGoal !== null)) {
      storeLead();
    }
  }, [qualificationData, email, phone, preferredChannel]);
  
  // Function to store lead data
  const storeLead = async () => {
    try {
      const response = await fetch('/api/leads/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          email: email || undefined,
          phone: phone || undefined,
          preferredChannel,
          qualification: qualificationData,
          interaction: {
            type: 'chat_update',
            data: { messages: messages.length }
          }
        }),
      });
      
      const data = await response.json();
      console.log('Lead data stored:', data);
      
      // Schedule follow-up if we have contact info and haven't scheduled one yet
      if ((email || phone) && preferredChannel && !hasScheduledFollowUp && 
          (qualificationData.hasWebsite !== null || qualificationData.mainGoal !== null)) {
        scheduleFollowUp('24h');
      }
    } catch (error) {
      console.error('Error storing lead data:', error);
    }
  };
  
  // Function to schedule follow-up messages
  const scheduleFollowUp = async (timing: 'immediate' | '24h' | '3d' | '7d') => {
    if (!preferredChannel || (!email && !phone)) return;
    
    try {
      const contactInfo = preferredChannel === 'email' ? email : phone;
      
      const response = await fetch('/api/messaging/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: contactInfo,
          channel: preferredChannel,
          userId,
          qualificationData,
          scheduleTiming: timing
        }),
      });
      
      const data = await response.json();
      console.log('Follow-up scheduled:', data);
      setHasScheduledFollowUp(true);
      
      // If we've qualified the lead as high-intent, also schedule more follow-ups
      if (qualificationData.qualified) {
        // Schedule additional follow-ups
        await fetch('/api/messaging/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: contactInfo,
            channel: preferredChannel,
            userId,
            qualificationData,
            scheduleTiming: '3d'
          }),
        });
        
        await fetch('/api/messaging/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: contactInfo,
            channel: preferredChannel,
            userId,
            qualificationData,
            scheduleTiming: '7d'
          }),
        });
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
    }
  };
  
  // New function to send cross-platform message
  const sendCrossPlatformMessage = async (message: string) => {
    if (!preferredChannel || (!email && !phone)) return;
    
    try {
      const contactInfo = preferredChannel === 'email' ? email : phone;
      
      const response = await fetch('/api/messaging/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: contactInfo,
          channel: preferredChannel,
          message,
          userId
        }),
      });
      
      const data = await response.json();
      console.log('Message sent via ' + preferredChannel + ':', data);
    } catch (error) {
      console.error('Error sending cross-platform message:', error);
    }
  };

  // Start qualification flow
  const startQualification = () => {
    // Ask if they have a website
    addMessage({
      id: uuidv4(),
      text: "Let me ask you a few quick questions to better understand your needs. Do you currently have a website?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'quickReplies',
      quickReplies: ["Yes", "No"]
    });
  };

  // Handle user message submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (inputValue.trim() === '') return;
    
    // Add user message
    addMessage({
      id: uuidv4(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    });
    
    setInputValue('');
    
    // Handle email collection if showing email input
    if (showEmailInput) {
      handleEmailSubmission(inputValue);
      return;
    }
    
    // Handle phone collection if showing phone input
    if (showPhoneInput) {
      handlePhoneSubmission(inputValue);
      return;
    }
    
    // Process user message
    processUserMessage(inputValue);
  };

  // Process user message logic
  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for common intents
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      showPricing();
    } else if (lowerMessage.includes('consult') || lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
      bookConsultation();
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('talk') || lowerMessage.includes('person')) {
      collectContactInfo();
    } else {
      // Default to qualification if we don't have that data yet
      if (qualificationData.hasWebsite === null) {
        startQualification();
      } else {
        // Generic response
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Thanks for your message! To best help you, I'd recommend either checking our pricing options or booking a free consultation with our team.",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Show me pricing", "Book a consultation"]
          });
        }, 500);
      }
    }
  };

  // Handle quick replies
  const handleQuickReply = (reply: string) => {
    // Add user quick reply as a message
    addMessage({
      id: uuidv4(),
      text: reply,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Process the quick reply
    switch (reply) {
      case "I have a question":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Great! I'd be happy to help. What would you like to know?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Book a consultation", "Show me pricing"]
          });
        }, 500);
        break;
        
      case "Show me pricing":
        showPricing();
        break;
        
      case "Book a consultation":
        bookConsultation();
        break;
        
      // Website qualification question replies
      case "Yes":
        // They have a website - update qualification data
        setQualificationData({
          ...qualificationData,
          hasWebsite: true
        });
        
        // Ask about their main goal
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Great! What's your main goal for improving your website?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: [
              "Get more customers",
              "Sell products online",
              "Build brand awareness"
            ]
          });
        }, 500);
        break;
        
      case "No":
        // They don't have a website - update qualification data
        setQualificationData({
          ...qualificationData,
          hasWebsite: false
        });
        
        // Ask about their main goal
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "I see! What's your main goal for your new website?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: [
              "Get more customers",
              "Sell products online",
              "Build brand awareness"
            ]
          });
        }, 500);
        break;
        
      // Main goal qualification replies
      case "Get more customers":
      case "Sell products online":
      case "Build brand awareness":
        // Update qualification data with their goal
        setQualificationData({
          ...qualificationData,
          mainGoal: reply
        });
        
        // Ask about their timeline
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "When are you looking to launch or update your website?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: [
              "ASAP",
              "Within 1 month",
              "Within 3 months",
              "Just exploring"
            ]
          });
        }, 500);
        break;
        
      // Timeline qualification replies
      case "ASAP":
      case "Within 1 month":
      case "Within 3 months":
      case "Just exploring":
        // Update qualification data with their timeline
        setQualificationData({
          ...qualificationData,
          timeline: reply
        });
        
        // Ask about their industry
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "What industry is your business in?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: [
              "E-commerce",
              "Professional Services",
              "Healthcare",
              "Real Estate",
              "Other"
            ]
          });
        }, 500);
        break;
        
      // Industry qualification replies
      case "E-commerce":
      case "Professional Services":
      case "Healthcare":
      case "Real Estate":
      case "Other":
        // Update qualification data with their industry
        setQualificationData(prev => ({
          ...prev,
          industry: reply
        }));
        
        // If they need it ASAP or soon, they're qualified (based on timeline from previous step)
        const isQualified = qualificationData.timeline === "ASAP" || qualificationData.timeline === "Within 1 month";
        setQualificationData(prev => ({
          ...prev,
          qualified: isQualified
        }));
        
        // For qualified leads, push pricing and consultation
        if (isQualified) {
          setTimeout(() => {
            addMessage({
              id: uuidv4(),
              text: `Thanks for sharing that! Based on your needs in the ${reply.toLowerCase()} industry, I think our team can definitely help you. Would you like to see our pricing options or schedule a free consultation to discuss your project in detail?`,
              sender: 'bot',
              timestamp: new Date(),
              type: 'quickReplies',
              quickReplies: [
                "Show me pricing",
                "Book a consultation"
              ]
            });
          }, 500);
        } else {
          // For longer-term prospects, collect contact info for nurturing
          setTimeout(() => {
            addMessage({
              id: uuidv4(),
              text: `Thanks for sharing that! We have experience working with ${reply.toLowerCase()} businesses and would be happy to keep you updated with resources and tips as you explore your options. What's the best way to stay in touch?`,
              sender: 'bot',
              timestamp: new Date(),
              type: 'quickReplies',
              quickReplies: [
                "Email",
                "WhatsApp",
                "SMS"
              ]
            });
          }, 500);
        }
        break;
        
      // Contact preference replies
      case "Email":
        setPreferredChannel('email');
        collectEmail();
        break;
        
      case "WhatsApp":
        setPreferredChannel('whatsapp');
        collectPhone();
        break;
        
      case "SMS":
        setPreferredChannel('sms');
        collectPhone();
        break;
        
      case "Yes, please":
        // Handle consultation reminder request
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Great! I'll send you a reminder before your scheduled consultation.",
            sender: 'bot',
            timestamp: new Date()
          });
          
          // Send an immediate confirmation
          sendCrossPlatformMessage("Thank you for scheduling a consultation with Kaizen Digital! This message confirms we'll send you a reminder before your appointment.");
          
          // Schedule a follow-up reminder (would be tied to actual consultation date in production)
          scheduleFollowUp('immediate');
        }, 500);
        break;
        
      case "No, thanks":
        // Handle declined reminder
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "No problem! If you have any questions before your consultation, feel free to ask here anytime.",
            sender: 'bot',
            timestamp: new Date()
          });
        }, 500);
        break;
        
      // Budget constraint replies
      case "I'm flexible":
      case "Need to stay within budget":
      case "Need it fast":
      case "No constraints":
        handleConstraints(reply);
        break;
        
      // Deposit option replies
      case "Yes, that works":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Great! To proceed with the 50% deposit option, we'll need to set up a brief consultation to discuss your project details. Would you like to schedule that now?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Book a consultation", "Contact me later"]
          });
        }, 500);
        break;
        
      case "I'd prefer other options":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "We also offer monthly payment plans that might work better for your budget. Let's schedule a consultation to discuss your project and find a payment structure that works for you.",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Book a consultation", "Send payment info"]
          });
        }, 500);
        break;
        
      case "Yes, tell me more":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Our expedited service includes dedicated resources and priority support. For your selected package, this would reduce delivery time from 4-6 weeks to 2-3 weeks. Would you like to schedule a consultation to discuss this option?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Book a consultation", "Ask a question"]
          });
        }, 500);
        break;
        
      case "No, standard timeline is fine":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Understood! Our standard timeline still offers great value and quality. Would you like to schedule a consultation to discuss your project details?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Book a consultation", "Ask a question"]
          });
        }, 500);
        break;
        
      case "Contact me later":
        collectContactInfo();
        break;
        
      case "Send payment info":
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "I'd be happy to send you our payment options. What's the best way to reach you?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Email", "WhatsApp", "SMS"]
          });
        }, 500);
        break;
        
      default:
        // Default response for unhandled quick replies
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "Thank you! Is there anything specific you'd like to know about our services?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Show me pricing", "Book a consultation"]
          });
        }, 500);
    }
  };

  // Show pricing options
  const showPricing = () => {
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: "Here are our website packages. Which one interests you?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'pricing',
        pricing: [
          {
            tier: "Basic",
            price: "$1,499",
            features: [
              "5-page responsive website",
              "Basic SEO setup",
              "Contact form",
              "2 rounds of revisions"
            ],
            cta: "Choose Basic"
          },
          {
            tier: "Business",
            price: "$2,999",
            features: [
              "10-page responsive website",
              "Advanced SEO package",
              "Live chat integration",
              "Content creation",
              "Social media integration"
            ],
            cta: "Choose Business"
          },
          {
            tier: "Enterprise",
            price: "$5,999+",
            features: [
              "Custom website development",
              "E-commerce functionality",
              "Payment processing",
              "Custom integrations",
              "Full SEO & analytics suite"
            ],
            cta: "Choose Enterprise"
          }
        ]
      });
    }, 500);
  };

  // Book a consultation
  const bookConsultation = () => {
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: "Great choice! Let's set up a free 30-minute consultation to discuss your project. You can schedule a time that works for you using the link below:",
        sender: 'bot',
        timestamp: new Date()
      });
      
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          text: "https://calendly.com/kaizendigitaldesign/30min",
          sender: 'bot',
          timestamp: new Date()
        });
        
        // If we have contact info, offer to send a reminder
        if (preferredChannel && (email || phone)) {
          setTimeout(() => {
            addMessage({
              id: uuidv4(),
              text: "Would you like me to send you a reminder about your consultation?",
              sender: 'bot',
              timestamp: new Date(),
              type: 'quickReplies',
              quickReplies: ["Yes, please", "No, thanks"]
            });
          }, 500);
        } else {
          // If we don't have contact info, ask for it
          setTimeout(() => {
            addMessage({
              id: uuidv4(),
              text: "To make sure you don't miss your consultation, I can send you a reminder. What's the best way to contact you?",
              sender: 'bot',
              timestamp: new Date(),
              type: 'quickReplies',
              quickReplies: ["Email", "WhatsApp", "SMS"]
            });
          }, 1000);
        }
      }, 500);
    }, 500);
  };

  // Handle pricing tier selection
  const handlePricingSelection = (tier: string) => {
    // Add user selection as a message
    addMessage({
      id: uuidv4(),
      text: `I'm interested in the ${tier} package`,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Mark as qualified based on package selection and update budget
    setQualificationData(prev => ({
      ...prev,
      qualified: true,
      budget: tier
    }));
    
    // Ask about budget flexibility
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: `Great choice! The ${tier} package is perfect for ${getPackageBenefit(tier)}. Do you have a specific budget or timeline constraint we should know about?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'quickReplies',
        quickReplies: [
          "I'm flexible",
          "Need to stay within budget",
          "Need it fast",
          "No constraints"
        ]
      });
    }, 500);
  };
  
  // Handle budget and timeline constraints
  const handleConstraints = (constraint: string) => {
    addMessage({
      id: uuidv4(),
      text: constraint,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Update budget flexibility information
    const needsDeposit = constraint === "Need to stay within budget";
    const needsExpedited = constraint === "Need it fast";
    
    setTimeout(() => {
      if (needsDeposit) {
        // Offer deposit option
        addMessage({
          id: uuidv4(),
          text: "We understand budget constraints! We offer a 50% deposit option to start your project, with the remainder due upon completion. Would this payment structure work for you?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quickReplies',
          quickReplies: [
            "Yes, that works",
            "I'd prefer other options",
            "Book a consultation"
          ]
        });
      } else if (needsExpedited) {
        // Offer expedited service
        addMessage({
          id: uuidv4(),
          text: "For time-sensitive projects, we offer expedited service with a 15% rush fee. This can reduce delivery time by up to 40%. Would you like to learn more about this option?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quickReplies',
          quickReplies: [
            "Yes, tell me more",
            "No, standard timeline is fine",
            "Book a consultation"
          ]
        });
      } else {
        // Standard flow for flexible clients
        addMessage({
          id: uuidv4(),
          text: "Perfect! Would you like to schedule a consultation to discuss the details of your project and how we can customize this package for your specific needs?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'quickReplies',
          quickReplies: [
            "Book a consultation",
            "Ask a question first"
          ]
        });
      }
    }, 500);
  };
  
  // Get benefit based on package tier
  const getPackageBenefit = (tier: string): string => {
    switch (tier) {
      case 'Basic':
        return 'small businesses just establishing their online presence';
      case 'Business':
        return 'growing businesses looking to expand their digital footprint';
      case 'Enterprise':
        return 'established businesses with complex needs and custom requirements';
      default:
        return 'businesses ready to enhance their online presence';
    }
  };

  // Collect email for follow-up
  const collectEmail = () => {
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: "Please enter your email address so we can stay in touch:",
        sender: 'bot',
        timestamp: new Date(),
        type: 'email'
      });
      
      setShowEmailInput(true);
    }, 500);
  };
  
  // Collect phone for SMS/WhatsApp
  const collectPhone = () => {
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: `Please enter your phone number for ${preferredChannel === 'whatsapp' ? 'WhatsApp' : 'SMS'} messages:`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'phone'
      });
      
      setShowPhoneInput(true);
    }, 500);
  };

  // Handle email submission
  const handleEmailSubmission = (email: string) => {
    setEmail(email);
    setShowEmailInput(false);
    
    if (isValidEmail) {
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          text: `Thanks! We'll be in touch at ${email} with more information about our services.`,
          sender: 'bot',
          timestamp: new Date()
        });
        
        // Send an immediate follow-up to their email
        sendCrossPlatformMessage(`Hi from Kaizen Digital! Thanks for your interest in our services. Let me know if you have any questions!`);
        
        // Continue the conversation
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "In the meantime, would you like to see our pricing options or schedule a consultation?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Show me pricing", "Book a consultation"]
          });
        }, 1000);
      }, 500);
    } else {
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          text: "That doesn't look like a valid email address. Could you please try again?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'email'
        });
        
        setShowEmailInput(true);
      }, 500);
    }
  };
  
  // Handle phone submission
  const handlePhoneSubmission = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setShowPhoneInput(false);
    
    // Simple validation - at least 10 digits
    const isValidPhone = /^\+?[0-9]{10,15}$/.test(phoneNumber.replace(/\s+/g, ''));
    
    if (isValidPhone) {
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          text: `Thanks! We'll be in touch at ${phoneNumber} with more information.`,
          sender: 'bot',
          timestamp: new Date()
        });
        
        // Send an immediate follow-up message
        sendCrossPlatformMessage(`Hi from Kaizen Digital! Thanks for your interest in our services. Let me know if you have any questions!`);
        
        // Continue the conversation
        setTimeout(() => {
          addMessage({
            id: uuidv4(),
            text: "In the meantime, would you like to see our pricing options or schedule a consultation?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'quickReplies',
            quickReplies: ["Show me pricing", "Book a consultation"]
          });
        }, 1000);
      }, 500);
    } else {
      setTimeout(() => {
        addMessage({
          id: uuidv4(),
          text: "That doesn't look like a valid phone number. Please include country code and area code (e.g., +1 555 123 4567).",
          sender: 'bot',
          timestamp: new Date(),
          type: 'phone'
        });
        
        setShowPhoneInput(true);
      }, 500);
    }
  };

  // Collect contact info for follow-up
  const collectContactInfo = () => {
    setTimeout(() => {
      addMessage({
        id: uuidv4(),
        text: "I'd be happy to connect you with our team. What's the best way to reach you?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'quickReplies',
        quickReplies: ["Email", "WhatsApp", "SMS"]
      });
    }, 500);
  };

  // Add a message to the chat
  const addMessage = (message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          <FaComment className="text-xl" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 sm:w-96 h-[500px] border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Kaizen Digital</h3>
              <p className="text-xs text-blue-100">Web Design & Development</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                
                {/* Quick Replies */}
                {message.sender === 'bot' && message.type === 'quickReplies' && (
                  <div className="mt-2 flex flex-wrap gap-2 justify-start">
                    {message.quickReplies?.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="bg-white text-blue-600 border border-blue-600 rounded-full px-3 py-1 text-sm font-medium hover:bg-blue-50 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Pricing Options */}
                {message.sender === 'bot' && message.type === 'pricing' && (
                  <div className="mt-2 grid gap-2">
                    {message.pricing?.map((option) => (
                      <div
                        key={option.tier}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-blue-700">{option.tier}</h4>
                          <span className="font-bold">{option.price}</span>
                        </div>
                        <ul className="text-xs text-gray-600 mb-2">
                          {option.features.map((feature, i) => (
                            <li key={i} className="mb-1">✓ {feature}</li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handlePricingSelection(option.tier)}
                          className="w-full bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {option.cta}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Email Input was shown */}
                {message.sender === 'bot' && message.type === 'email' && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">
                      <FaRegClock className="inline mr-1" />
                      We respect your privacy and won't spam you
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            {showEmailInput ? (
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`bg-blue-600 text-white rounded-r-lg p-2 ${
                    isValidEmail ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isValidEmail}
                >
                  Submit
                </button>
              </div>
            ) : showPhoneInput ? (
              <div className="flex">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-r-lg p-2 hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-r-lg p-2 hover:bg-blue-700"
                  disabled={inputValue.trim() === ''}
                >
                  <FaRegPaperPlane />
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 