import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Define response types
interface MessageSuccess {
  success: true;
  sid: string;
}

interface MessageError {
  success: false;
  error: string;
}

type MessageResult = MessageSuccess | MessageError;

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: NextRequest) {
  try {
    const { recipient, channel, message, userId } = await request.json();
    
    if (!recipient || !channel || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Log message attempt
    console.log(`Attempting to send ${channel} message to ${recipient}`);
    
    let result: MessageResult = { success: false, error: 'Messaging service not configured' };
    
    // Send message based on the channel
    if (client) {
      switch (channel) {
        case 'sms':
          if (twilioNumber) {
            const smsResponse = await client.messages.create({
              body: message,
              from: twilioNumber,
              to: recipient,
            });
            result = { success: true, sid: smsResponse.sid };
          } else {
            result = { success: false, error: 'SMS number not configured' };
          }
          break;
          
        case 'whatsapp':
          const whatsappResponse = await client.messages.create({
            body: message,
            from: `whatsapp:${twilioWhatsappNumber}`,
            to: `whatsapp:${recipient}`
          });
          result = { success: true, sid: whatsappResponse.sid };
          break;
          
        case 'email':
          // For email, we'd typically use a different service like SendGrid
          // This is a placeholder for integration with an email service
          result = { 
            success: false, 
            error: 'Email sending requires additional integration' 
          };
          break;
          
        default:
          result = { success: false, error: 'Invalid channel' };
      }
    }
    
    // Store message in database (future enhancement)
    // For now, just log it
    console.log(`Message to ${recipient} via ${channel} - Status: ${result.success ? 'Sent' : 'Failed'}`);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in messaging API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 