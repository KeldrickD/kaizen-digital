import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import ContactFormEmail from '@/app/emails/ContactFormEmail';

// Initialize Resend conditionally to avoid build errors
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, service, captchaToken } = body;

    // Verify hCaptcha token if secret key is available
    if (process.env.HCAPTCHA_SECRET_KEY && captchaToken) {
      const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      });

      const hcaptchaData = await hcaptchaResponse.json();

      if (!hcaptchaData.success) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }

    // Store the contact form submission in the database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        message,
        service,
        status: 'new',
      },
    });

    // Send email notifications only if Resend is configured
    if (resend) {
      try {
        // Send email notification to admin
        await resend.emails.send({
          from: 'Kaizen Digital Design <contact@kaizendigital.design>',
          to: ['your-email@example.com'], // Replace with your email
          subject: `New Contact Form Submission from ${name}`,
          react: ContactFormEmail({
            name,
            email,
            phone,
            message,
            service,
          }),
        });

        // Send auto-reply to the customer
        await resend.emails.send({
          from: 'Kaizen Digital Design <contact@kaizendigital.design>',
          to: [email],
          subject: 'Thank you for contacting Kaizen Digital Design',
          react: ContactFormEmail({
            name,
            email,
            phone,
            message,
            service,
          }),
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Continue with the form submission even if email sending fails
      }
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 