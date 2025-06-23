import nodemailer from 'nodemailer';

interface EmailData {
  name: string;
  email: string;
  message: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  async sendContactEmail(data: EmailData): Promise<boolean> {
    try {
      // Email to you (the portfolio owner)
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to your own email
        subject: `Portfolio Contact: ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
              <p style="margin: 0; color: #0066cc;">
                <strong>Quick Reply:</strong> 
                <a href="mailto:${data.email}?subject=Re: Your Portfolio Contact&body=Hi ${data.name},%0A%0AThank you for reaching out! ">
                  Reply to ${data.name}
                </a>
              </p>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              This email was sent from your portfolio contact form at meetaayush.com
            </p>
          </div>
        `,
      };

      // Auto-reply to the contact person
      const autoReplyOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: 'Thank you for contacting me!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
              Thank You for Your Message!
            </h2>
            
            <p>Hi ${data.name},</p>
            
            <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul style="line-height: 1.8;">
              <li>Check out my projects at <a href="https://meetaayush.com/#projects">meetaayush.com</a></li>
              <li>Connect with me on <a href="https://linkedin.com/in/aayush-gupta">LinkedIn</a></li>
              <li>View my code on <a href="https://github.com/Aayush8356">GitHub</a></li>
            </ul>
            
            <p>Looking forward to connecting with you!</p>
            
            <p>Best regards,<br>
            <strong>Aayush Gupta</strong><br>
            Full Stack Developer</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              This is an automated response from meetaayush.com
            </p>
          </div>
        `,
      };

      // Send both emails
      await Promise.all([
        this.transporter.sendMail(mailOptions),
        this.transporter.sendMail(autoReplyOptions)
      ]);

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();