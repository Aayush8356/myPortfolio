const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('App Password:', process.env.EMAIL_APP_PASSWORD ? 'Set ✓' : 'Not Set ✗');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    // Test connection
    console.log('\nTesting SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🧪 Portfolio Contact Form Test',
      html: `
        <h2>Email Service Test Successful! 🎉</h2>
        <p>Your portfolio contact form email service is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>This confirms that:</p>
        <ul>
          <li>✅ Gmail SMTP connection is working</li>
          <li>✅ App Password is correct</li>
          <li>✅ Email service is ready for production</li>
        </ul>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is a test email from your portfolio backend.
        </p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎯 Check your Gmail inbox for the test email!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Double-check your App Password is correct');
      console.log('2. Make sure 2FA is enabled on your Gmail account');
      console.log('3. Try generating a new App Password');
    }
  }
}

testEmail();