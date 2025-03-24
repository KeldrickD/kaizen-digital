import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// Initialize SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER || 'admin@kaizendigital.design',
    pass: process.env.EMAIL_PASS,
  },
});

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

/**
 * Send an email using the best available method.
 * Tries SendGrid first, then falls back to SMTP if SendGrid fails or isn't configured.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const fromEmail = options.from || process.env.EMAIL_FROM || 'admin@kaizendigital.design';
  const fromName = 'Kaizen Digital Design';
  
  console.log(`Attempting to send email to ${options.to}`);
  
  // Try SendGrid first if API key is available
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        to: options.to,
        from: {
          email: fromEmail,
          name: fromName
        },
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      });
      
      console.log(`Email sent to ${options.to} using SendGrid`);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      console.log('Falling back to SMTP...');
      // Fall back to SMTP if SendGrid fails
    }
  }
  
  // Try SMTP if SendGrid isn't configured or failed
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || '',
      });
      
      console.log(`Email sent to ${options.to} using SMTP`);
      return true;
    } catch (error) {
      console.error('SMTP email error:', error);
    }
  }
  
  // Last resort - log that we would have sent an email
  console.log('WOULD HAVE SENT EMAIL:');
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`From: ${fromName} <${fromEmail}>`);
  
  return false;
}

/**
 * Send login credentials to a customer
 */
export async function sendCredentialsEmail({ 
  to, 
  name, 
  password, 
  subscriptionType 
}: {
  to: string;
  name: string;
  password: string;
  subscriptionType: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kaizendigitaldesign.com'}/auth/customer-login?callbackUrl=/dashboard`;
  const googleFormUrl = "https://forms.gle/UZ9dJCaGH9YAVdtN9";

  return sendEmail({
    to,
    subject: 'Your Kaizen Digital Account Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <h2>Thank You for Your Purchase!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for choosing Kaizen Digital Design. Your payment has been processed successfully.</p>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f7f7f7; border-left: 4px solid #e61919;">
            <p style="margin-top: 0;"><strong>Next Step:</strong> Please complete our website information form to help us understand your needs:</p>
            <div style="text-align: center; margin: 15px 0;">
              <a href="${googleFormUrl}" style="background-color: #e61919; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Complete Website Information Form</a>
            </div>
          </div>
          
          <p><strong>Here are your dashboard login credentials:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <div style="margin: 25px 0; text-align: center;">
            <a href="${loginUrl}" style="background-color: #3a86ff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Your Dashboard</a>
          </div>
          <p>Please keep this information secure. You can access your dashboard at any time to track your subscription and manage your account.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          <p>Thank you for choosing Kaizen Digital Design!</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
        </div>
      </div>
    `,
  });
} 