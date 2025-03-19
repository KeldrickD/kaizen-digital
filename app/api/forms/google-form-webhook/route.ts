import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER || 'admin@kaizendigital.design',
    pass: process.env.EMAIL_PASS,
  },
});

// This is the handler for Google Form webhook submissions
export async function POST(request: Request) {
  try {
    // Parse the incoming data from the Google Form
    const formData = await request.json();
    console.log('Received form data:', formData);
    
    // Expected form fields
    // Note: Adjust these field names to match your actual Google Form field names
    const {
      email,
      name,
      companyName,
      phone,
      websiteUrl,
      websiteGoals,
      designPreferences,
      // Add any other fields from your form
    } = formData;
    
    if (!email) {
      console.error('Missing required field: email');
      return NextResponse.json({ 
        error: 'Missing required field: email' 
      }, { status: 400 });
    }

    // Check if a customer with this email already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: { email },
      include: { subscriptions: true }
    });
    
    console.log('Found customer:', existingCustomer ? existingCustomer.id : 'None');

    if (!existingCustomer) {
      console.error(`No customer found with email: ${email}`);
      return NextResponse.json({ 
        error: 'No matching customer found for this email. Please contact support.' 
      }, { status: 404 });
    }

    // Generate a random password
    const password = crypto.randomBytes(8).toString('hex');
    console.log(`Generated password for ${email}: ${password}`);
    
    // Hash the password for storage
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    try {
      // Update the customer with the form information and credentials
      const updatedCustomer = await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: name || existingCustomer.name,
          passwordHash: hashedPassword,
          companyName: companyName || '',
          phone: phone || '',
          websiteUrl: websiteUrl || '',
          websiteGoals: websiteGoals || '',
          designPreferences: designPreferences || '',
          formSubmitted: true,
          formSubmittedAt: new Date(),
        }
      });
      
      console.log('Updated customer:', updatedCustomer.id);
    } catch (error) {
      console.error('Error updating customer:', error);
      return NextResponse.json({ 
        error: 'Failed to update customer record'
      }, { status: 500 });
    }

    // Send the login credentials via email
    try {
      await sendCredentialsEmail({
        to: email,
        name: name || email,
        password,
        subscriptionType: existingCustomer.subscriptions?.[0]?.planName || 'Website Maintenance',
      });
      console.log('Credentials email sent to:', email);
    } catch (error) {
      console.error('Error sending credentials email:', error);
      // Continue execution even if email fails
    }

    // Send notification to admin
    try {
      await sendAdminNotificationEmail({
        customerEmail: email,
        customerName: name || email,
        formData,
      });
      console.log('Admin notification email sent');
    } catch (error) {
      console.error('Error sending admin email:', error);
      // Continue execution even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Form processed and credentials sent successfully',
    });
    
  } catch (error: any) {
    console.error('Error processing form submission:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process form submission' 
    }, { status: 500 });
  }
}

// Function to send login credentials to the customer
async function sendCredentialsEmail({ to, name, password, subscriptionType }: {
  to: string;
  name: string;
  password: string;
  subscriptionType: string;
}) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kaizendigitaldesign.com'}/auth/customer-login?callbackUrl=/dashboard`;

  const mailOptions = {
    from: `"Kaizen Digital" <${process.env.EMAIL_FROM || 'admin@kaizendigital.design'}>`,
    to,
    subject: `Your Kaizen Digital Dashboard Access`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #e61919; margin: 0;">Kaizen Digital Design</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <h2>Your Dashboard Access Is Ready!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for submitting your website information form. Your dashboard access has been created for your ${subscriptionType} service.</p>
          <p><strong>Here are your login credentials:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <div style="margin: 25px 0; text-align: center;">
            <a href="${loginUrl}" style="background-color: #e61919; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Access Your Dashboard</a>
          </div>
          <p>Please keep this information secure. You can change your password once you login to your dashboard.</p>
          <p>If you have any questions or need assistance with your dashboard, please don't hesitate to contact us.</p>
          <p>Thank you for choosing Kaizen Digital Design!</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} Kaizen Digital Design. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  // Log email attempt
  console.log('Attempting to send email to:', to);
  console.log('Email configuration:', {
    host: process.env.EMAIL_HOST || 'mail.privateemail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true' || true,
    auth: {
      user: process.env.EMAIL_USER || 'admin@kaizendigital.design',
    }
  });

  // Only attempt to send if we have email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email sending skipped - no credentials provided');
    console.log('Would have sent:', mailOptions);
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to notify admin about the form submission
async function sendAdminNotificationEmail({ customerEmail, customerName, formData }: {
  customerEmail: string;
  customerName: string;
  formData: any;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kaizendigital.design';

  // Format form data for admin email
  const formDataHtml = Object.entries(formData)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join('');

  const mailOptions = {
    from: `"Kaizen Digital" <${process.env.EMAIL_FROM || 'admin@kaizendigital.design'}>`,
    to: adminEmail,
    subject: `New Form Submission: ${customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
          <h2>New Form Submission</h2>
          <p>A customer has submitted the website information form:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Customer:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
          </ul>
          <h3>Form Data:</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${formDataHtml}
          </ul>
          <p>Customer account has been created and login credentials have been sent.</p>
          <p>You can view full customer details in the <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/customers">admin dashboard</a>.</p>
        </div>
      </div>
    `,
  };

  // Only attempt to send if we have email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Admin email sending skipped - no credentials provided');
    console.log('Would have sent:', mailOptions);
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending admin email:', error);
    throw error;
  }
} 