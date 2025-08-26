import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  // For development, use Ethereal Email (test account)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
    console.log('Using Ethereal Email for development');
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  return nodemailer.createTransporter(config);
};

// Email templates
const emailTemplates = {
  // Order confirmation email
  orderConfirmation: (order, user) => ({
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #4F46E5; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order, ${user.firstName}!</p>
          </div>
          
          <div class="content">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            
            <h3>Items Ordered</h3>
            ${order.items.map(item => `
              <div class="order-item">
                <strong>${item.box.name}</strong><br>
                Quantity: ${item.quantity} × ₹${item.price} = ₹${item.total}
              </div>
            `).join('')}
            
            <h3>Order Summary</h3>
            <p>Subtotal: ₹${order.subtotal}</p>
            <p>Shipping: ₹${order.shipping}</p>
            <p>Tax: ₹${order.tax}</p>
            ${order.referralDiscount ? `<p>Referral Discount: -₹${order.referralDiscount}</p>` : ''}
            <p class="total">Total: ₹${order.total}</p>
            
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
              ${order.shippingAddress.phone}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" class="button">
                Track Your Order
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Surprise Tokri!</p>
            <p>If you have any questions, contact us at support@surprisetokri.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Password reset email
  passwordReset: (user, resetToken) => ({
    subject: 'Reset Your Password - Surprise Tokri',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .warning { background: #FEF3CD; border: 1px solid #F59E0B; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hello ${user.firstName},</p>
            
            <p>We received a request to reset your password for your Surprise Tokri account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}" class="button">
                Reset Your Password
              </a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              If you didn't request this password reset, please ignore this email.
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4F46E5;">
              ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}
            </p>
          </div>
          
          <div class="footer">
            <p>If you have any questions, contact us at support@surprisetokri.com</p>
            <p>Surprise Tokri Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Contact form notification
  contactNotification: (contactData) => ({
    subject: `New Contact Form Submission - ${contactData.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #4F46E5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div>${contactData.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div>${contactData.email}</div>
            </div>
            
            ${contactData.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div>${contactData.phone}</div>
            </div>
            ` : ''}
            
            ${contactData.category ? `
            <div class="field">
              <div class="label">Category:</div>
              <div>${contactData.category}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div>${contactData.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div style="white-space: pre-wrap;">${contactData.message}</div>
            </div>
            
            <div class="field">
              <div class="label">Submitted At:</div>
              <div>${new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Contact form auto-reply
  contactAutoReply: (contactData) => ({
    subject: 'Thank you for contacting Surprise Tokri',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Contacting Us</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You!</h1>
          </div>
          
          <div class="content">
            <p>Dear ${contactData.name},</p>
            
            <p>Thank you for contacting Surprise Tokri! We have received your message and will get back to you within 24 hours.</p>
            
            <p><strong>Your Message Summary:</strong></p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            
            <p>If your inquiry is urgent, please call us at +91-9876543210 or email us directly at support@surprisetokri.com</p>
            
            <p>Thank you for choosing Surprise Tokri!</p>
          </div>
          
          <div class="footer">
            <p>Best regards,<br>Surprise Tokri Team</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Order status update
  orderStatusUpdate: (order, user, newStatus) => ({
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status { background: #10B981; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Status Update</h1>
          </div>
          
          <div class="content">
            <p>Hello ${user.firstName},</p>
            
            <p>Your order <strong>${order.orderNumber}</strong> has been updated.</p>
            
            <div class="status">
              Status: ${newStatus.toUpperCase()}
            </div>
            
            ${order.trackingNumber ? `
            <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order._id}" class="button">
                Track Your Order
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with Surprise Tokri!</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Main email sending function
export const sendEmail = async (to, templateName, data, options = {}) => {
  try {
    const transporter = createTransporter();
    
    if (!emailTemplates[templateName]) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const template = emailTemplates[templateName](data, options);
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Surprise Tokri'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
      ...options
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to,
      subject: template.subject
    });

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };

  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Bulk email sending function
export const sendBulkEmail = async (recipients, templateName, data, options = {}) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail(recipient, templateName, data, options);
      results.push({ recipient, success: true, ...result });
    } catch (error) {
      results.push({ recipient, success: false, error: error.message });
    }
  }
  
  return results;
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email connection verified' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default { sendEmail, sendBulkEmail, testEmailConnection };