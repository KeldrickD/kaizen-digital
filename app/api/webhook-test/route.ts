import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    console.log('Test webhook called');
    
    // Log all environment variables (sensitive values redacted)
    console.log('Environment variables:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
    console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE || 'Not set');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set (value hidden)' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (value hidden)' : 'Not set');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Not set');
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set (value hidden)' : 'Not set');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Get test recipient from request or use default
    const to = body.email || 'admin@kaizendigital.design';
    
    // Try to send a test email
    console.log('Attempting to send test email to:', to);
    
    const success = await sendEmail({
      to,
      subject: 'Test Email from Kaizen Digital',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>This is a test email</h2>
          <p>If you're seeing this, the email sending is working correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send email through any available method',
        config: {
          host: process.env.EMAIL_HOST || 'mail.privateemail.com',
          port: parseInt(process.env.EMAIL_PORT || '465'),
          secure: process.env.EMAIL_SECURE === 'true' || true,
          user: process.env.EMAIL_USER ? 'Set (value hidden)' : 'Not set',
          pass: process.env.EMAIL_PASS ? 'Set (value hidden)' : 'Not set',
          sendgrid: process.env.SENDGRID_API_KEY ? 'Set (value hidden)' : 'Not set',
        },
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in test webhook:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
} 