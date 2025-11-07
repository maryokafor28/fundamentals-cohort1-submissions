import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend only if API key exists
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Gmail transporter for production
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  name: string,
  data: { otp?: number; newPassword?: string; loginLink?: string; orderId?: string; orderLink?: string; [key: string]: any }
) => {
  let html = '';

  // Generate email HTML based on data
  if (data.otp) {
    html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <h1 style="color: #4CAF50;">Email Verification</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering. Please use this OTP to verify your email:</p>
          <div style="background: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #4CAF50; font-size: 36px; margin: 0;">${data.otp}</h2>
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
        </div>
      </body>
      </html>
    `;
  } else if (data.newPassword) {
    html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <h1 style="color: #FF9800;">Password Reset</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your temporary password is:</p>
          <div style="background: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #FF9800;">${data.newPassword}</h3>
          </div>
          <p><a href="${data.loginLink}" style="background: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Login Now</a></p>
        </div>
      </body>
      </html>
    `;
  } else if (data.orderId) {
    html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <h1 style="color: #4CAF50;">Order Confirmation</h1>
          <p>Hello <strong>${name || 'Customer'}</strong>,</p>
          <p>Your order has been successfully processed!</p>
          <div style="background: white; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #4CAF50;">Order ID: ${data.orderId}</h3>
          </div>
          ${data.orderLink ? `<p><a href="${data.orderLink}" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a></p>` : ''}
        </div>
      </body>
      </html>
    `;
  }

  try {
    console.log(`🔧 Email Config Check:`);
    console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`- GMAIL_USER: ${process.env.GMAIL_USER ? 'Set' : 'Not Set'}`);
    console.log(`- RESEND_API_KEY: ${process.env.RESEND_API_KEY ? 'Set' : 'Not Set'}`);
    console.log(`- Sending to: ${to}`);
    console.log(`- Subject: ${subject}`);
    
    // Use Gmail in production, Resend in development
    if (process.env.NODE_ENV === 'production' && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Attempting Gmail send...');
      await gmailTransporter.sendMail({
        from: `"mservice" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html: html || 'Email content',
      });
      console.log(`✅ Email sent via Gmail to ${to}`);
    } else if (process.env.RESEND_API_KEY && resend) {
      console.log('📧 Attempting Resend send...');
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [to],
        subject,
        html: html || 'Email content',
      });
      console.log(`✅ Email sent via Resend to ${to}`, result);
    } else {
      console.log('⚠️ No email service configured - email only logged to console');
      console.log(`📩 EMAIL CONTENT FOR ${to}:`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML: ${html}`);
      if (data.otp) {
        console.log(`🔑 OTP: ${data.otp}`);
      }
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.log(`📩 FALLBACK - OTP for ${to}: ${data.otp || 'N/A'}`);
    // Don't throw error to prevent registration failure
  }
};