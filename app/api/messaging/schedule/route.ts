import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Define types
interface ScheduledMessage {
  recipient: string;
  channel: 'email' | 'whatsapp' | 'sms';
  message: string;
  sendAt: Date;
  userId: string;
  metadata?: any;
}

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

// For production, you'd want to use a real database to store scheduled messages
// This is just a simple in-memory storage for demo purposes
const scheduledMessages: ScheduledMessage[] = [];

// Function to generate appropriate follow-up message based on qualification data
function generateFollowUpMessage(qualificationData: any, timing: 'immediate' | '24h' | '3d' | '7d'): string {
  const hasWebsite = qualificationData?.hasWebsite;
  const mainGoal = qualificationData?.mainGoal;
  const timeline = qualificationData?.timeline;
  
  // Base message that's generic enough for any situation
  let message = "Hi there! Thanks for your interest in Kaizen Digital. ";
  
  // Customize based on qualification data
  if (timing === 'immediate') {
    message += "I wanted to follow up on your website inquiry. ";
  } else if (timing === '24h') {
    message += "Just checking in about your website project. ";
  } else if (timing === '3d') {
    message += "I hope you're doing well! I wanted to touch base about your website inquiry from a few days ago. ";
  } else {
    message += "I noticed you were interested in getting a website. Our team still has availability this month. ";
  }
  
  // Customize based on their website status
  if (hasWebsite === false) {
    message += "As you mentioned, you don't currently have a website. ";
    
    if (mainGoal === "Get more customers") {
      message += "A new website could significantly increase your customer reach. ";
    } else if (mainGoal === "Sell products online") {
      message += "Our e-commerce solutions can help you start selling online quickly. ";
    } else if (mainGoal === "Build brand awareness") {
      message += "We can help establish your online presence with a professional brand image. ";
    }
  } else if (hasWebsite === true) {
    message += "Since you already have a website, we can focus on improving its performance. ";
    
    if (mainGoal === "Get more customers") {
      message += "Our optimization can help increase traffic and conversions. ";
    } else if (mainGoal === "Sell products online") {
      message += "We can enhance your e-commerce capabilities for better results. ";
    }
  }
  
  // Add call to action based on timing
  if (timing === 'immediate' || timing === '24h') {
    message += "Would you like to schedule a quick call to discuss your needs in more detail? Or you can view our packages at kaizen-digital.com/pricing";
  } else {
    message += "We're offering a 15% discount this week. You can claim it at kaizen-digital.com/special-offer";
  }
  
  return message;
}

// Endpoint to schedule a new message
export async function POST(request: NextRequest) {
  try {
    const { recipient, channel, userId, qualificationData, scheduleTiming } = await request.json();
    
    if (!recipient || !channel || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Generate message based on qualification data
    const message = generateFollowUpMessage(qualificationData, scheduleTiming || 'immediate');
    
    // Calculate send time based on schedule timing
    let sendAt = new Date();
    switch (scheduleTiming) {
      case '24h':
        sendAt.setHours(sendAt.getHours() + 24);
        break;
      case '3d':
        sendAt.setDate(sendAt.getDate() + 3);
        break;
      case '7d':
        sendAt.setDate(sendAt.getDate() + 7);
        break;
      default:
        // immediate - add a small delay (5 minutes)
        sendAt.setMinutes(sendAt.getMinutes() + 5);
    }
    
    // Create scheduled message
    const scheduledMessage: ScheduledMessage = {
      recipient,
      channel,
      message,
      sendAt,
      userId,
      metadata: {
        qualificationData,
        scheduleTiming
      }
    };
    
    // Store the scheduled message
    scheduledMessages.push(scheduledMessage);
    
    // If using Twilio Scheduler in production:
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: message,
    //   from: channel === 'whatsapp' ? `whatsapp:${twilioWhatsappNumber}` : twilioNumber,
    //   to: channel === 'whatsapp' ? `whatsapp:${recipient}` : recipient,
    //   scheduledAt: sendAt
    // });
    
    return NextResponse.json({
      success: true,
      scheduledMessage: {
        id: scheduledMessages.length,
        sendAt: sendAt.toISOString(),
        channel,
        recipient: recipient.substring(0, 4) + '****' + recipient.substring(recipient.length - 4) // Privacy
      }
    });
  } catch (error: any) {
    console.error('Error in message scheduling API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// For a production app, you would use a cron job or a service like Twilio Functions
// to periodically check and send scheduled messages
export async function GET(request: NextRequest) {
  // This endpoint would typically be called by a cron job to process and send scheduled messages
  // For demo purposes, we'll just return the currently scheduled messages
  
  const pendingCount = scheduledMessages.filter(msg => msg.sendAt > new Date()).length;
  const sentCount = scheduledMessages.length - pendingCount;
  
  return NextResponse.json({
    success: true,
    stats: {
      total: scheduledMessages.length,
      pending: pendingCount,
      sent: sentCount
    }
  });
} 