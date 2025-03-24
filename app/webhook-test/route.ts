import { NextResponse } from 'next/server';
import { sendEmail } from '../../lib/email';

export async function POST(request: Request) {
  try {
    console.log('Test webhook called');
    
    // Log all environment variables (sensitive values redacted)
    console.log('Environment variables:');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'Not set');
    console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE || 'Not set');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
    console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set' : 'Not set');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    // Attempt to send a test email
    if (body.email) {
      console.log(`Attempting to send test email to ${body.email}`);
      
      try {
        const result = await sendEmail({
          to: body.email,
          subject: 'Kaizen Digital Design - Test Email',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #000; padding: 20px; text-align: center;">
                <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
              </div>
              <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
                <h2>Test Email</h2>
                <p>This is a test email sent from the webhook test endpoint.</p>
                <p>If you received this email, your email configuration is working correctly.</p>
                <p>Time sent: ${new Date().toISOString()}</p>
              </div>
            </div>
          `,
        });
        
        console.log('Email send result:', result);
        
        return NextResponse.json({
          success: true,
          message: 'Test webhook processed',
          emailSent: result
        });
      } catch (emailError: unknown) {
        console.error('Error sending test email:', emailError);
        
        return NextResponse.json({
          success: false,
          message: 'Test webhook processed but email sending failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook processed',
      note: 'No email was sent because no email address was provided'
    });
  } catch (error: unknown) {
    console.error('Error processing test webhook:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error processing test webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 