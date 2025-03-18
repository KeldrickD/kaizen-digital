import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Using test email settings for development
// In production, you would use your real email service settings
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { 
      templateType, 
      customerEmail, 
      customerName, 
      amount,
      remainingAmount,
      packageType,
      paymentUrl,
      adminEmail = process.env.ADMIN_EMAIL || 'support@kaizendigitaldesign.com'
    } = await request.json();
    
    if (!templateType || !customerEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: templateType and customerEmail are required' 
      }, { status: 400 });
    }
    
    // Format amount for display
    const formatAmount = (amountInCents: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amountInCents / 100);
    };
    
    let emailSubject = '';
    let emailHtml = '';
    let recipientEmail = '';
    
    // Select email template based on type
    switch(templateType) {
      case 'deposit_confirmation':
        emailSubject = `Thank You for Your Deposit - Kaizen Digital Design`;
        recipientEmail = customerEmail;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
              <h2>Thank You for Your Deposit!</h2>
              <p>Hello ${customerName || 'there'},</p>
              <p>We're excited to confirm that your deposit of ${formatAmount(amount)} has been received for your ${packageType} website package.</p>
              <p>Here's what happens next:</p>
              <ol>
                <li>Our team will review your intake form responses.</li>
                <li>We'll reach out to schedule an initial consultation.</li>
                <li>We'll begin work on your website design.</li>
                <li>Once your design is ready for review, we'll contact you for the remaining payment of ${formatAmount(remainingAmount)}.</li>
              </ol>
              <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
              <p>Thank you for choosing Kaizen Digital Design!</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
            </div>
          </div>
        `;
        break;
        
      case 'remaining_balance_request':
        emailSubject = `Complete Your Website Payment - Kaizen Digital Design`;
        recipientEmail = customerEmail;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
              <h2>Your Website is Ready!</h2>
              <p>Hello ${customerName || 'there'},</p>
              <p>Great news! Your website design is complete and ready for final review.</p>
              <p>To proceed with the final steps and launch your website, please complete your remaining balance payment of ${formatAmount(remainingAmount)}.</p>
              <div style="margin: 25px 0; text-align: center;">
                <a href="${paymentUrl}" style="background-color: #e61919; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Complete Payment</a>
              </div>
              <p>After your payment is processed, we'll finalize your website and prepare it for launch.</p>
              <p>If you have any questions or need assistance with your payment, please don't hesitate to contact us.</p>
              <p>Thank you for choosing Kaizen Digital Design!</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
            </div>
          </div>
        `;
        break;
        
      case 'payment_complete':
        emailSubject = `Payment Complete - Kaizen Digital Design`;
        recipientEmail = customerEmail;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
              <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
              <h2>Thank You for Your Payment!</h2>
              <p>Hello ${customerName || 'there'},</p>
              <p>We're pleased to confirm that your final payment of ${formatAmount(amount)} has been received. Thank you!</p>
              <p>Your website project is now fully paid, and we're excited to proceed with the final steps to launch your website.</p>
              <p>Our team will be in touch shortly with information about your website launch and how to access your new website.</p>
              <p>If you have any questions in the meantime, please don't hesitate to contact us.</p>
              <p>Thank you for choosing Kaizen Digital Design!</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
            </div>
          </div>
        `;
        break;
        
      case 'admin_notification':
        emailSubject = `New Payment Received: ${customerName || customerEmail}`;
        recipientEmail = adminEmail;
        emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
              <h2>New Payment Notification</h2>
              <p>A new payment has been received from a customer:</p>
              <ul style="list-style-type: none; padding: 0;">
                <li><strong>Customer:</strong> ${customerName || 'Not provided'}</li>
                <li><strong>Email:</strong> ${customerEmail}</li>
                <li><strong>Package:</strong> ${packageType}</li>
                <li><strong>Amount:</strong> ${formatAmount(amount)}</li>
                <li><strong>Payment Type:</strong> ${remainingAmount > 0 ? 'Deposit' : 'Full Payment'}</li>
                ${remainingAmount > 0 ? `<li><strong>Remaining:</strong> ${formatAmount(remainingAmount)}</li>` : ''}
              </ul>
              <p>You can view full payment details in the <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/payments">admin dashboard</a>.</p>
            </div>
          </div>
        `;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
    }
    
    // Send the email
    const mailOptions = {
      from: `"Kaizen Digital" <${process.env.EMAIL_FROM || 'noreply@kaizendigitaldesign.com'}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    };
    
    // Only attempt to send if we have email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email sending skipped - no credentials provided');
      console.log('Would have sent:', mailOptions);
      
      return NextResponse.json({
        success: true,
        message: 'Email notification would be sent (skipped - no credentials)',
      });
    }
    
    const info = await transporter.sendMail(mailOptions);
    
    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
      messageId: info.messageId,
    });
    
  } catch (error: any) {
    console.error('Error sending email notification:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send email notification' 
    }, { status: 500 });
  }
} 