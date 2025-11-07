import { Controller, Post, Body } from '@nestjs/common';
import { sendEmail } from '../utility/email-handler';

@Controller('test')
export class EmailTestController {
  
  @Post('email')
  async testEmail(@Body() body: { email: string }) {
    try {
      await sendEmail(
        body.email,
        'Test Email - mservice',
        'Test User',
        { otp: 123456 }
      );
      
      return {
        success: true,
        message: 'Test email sent successfully',
        note: 'Check console logs for detailed information'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        note: 'Check console logs for detailed error information'
      };
    }
  }

  @Post('config')
  async checkEmailConfig() {
    return {
      success: true,
      config: {
        NODE_ENV: process.env.NODE_ENV,
        GMAIL_USER: process.env.GMAIL_USER ? 'Set' : 'Not Set',
        GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Not Set',
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not Set'
      },
      recommendation: !process.env.RESEND_API_KEY && !process.env.GMAIL_USER ? 
        'Please set up either RESEND_API_KEY or GMAIL credentials in your .env file' : 
        'Email service should be working'
    };
  }
}