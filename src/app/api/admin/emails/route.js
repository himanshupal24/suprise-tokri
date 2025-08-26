import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import { sendEmail, sendBulkEmail, testEmailConnection } from '../../../../lib/email.js';
import User from '../../../../models/User.js';
import { requireAdmin } from '../../../../lib/auth.js';

// POST - Send test email or bulk emails
export async function POST(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    const body = await request.json();
    const { type, recipients, templateName, data, subject, message } = body;

    switch (type) {
      case 'test':
        // Test email connection
        const connectionTest = await testEmailConnection();
        if (!connectionTest.success) {
          return NextResponse.json(
            { error: 'Email connection failed', details: connectionTest.error },
            { status: 500 }
          );
        }

        // Send test email
        const testEmail = process.env.ADMIN_EMAIL || 'test@example.com';
        const testResult = await sendEmail(testEmail, 'contactAutoReply', {
          name: 'Test User',
          subject: 'Email Service Test'
        });

        return NextResponse.json({
          message: 'Test email sent successfully',
          result: testResult
        });

      case 'template':
        // Send email using template
        if (!recipients || !templateName || !data) {
          return NextResponse.json(
            { error: 'Recipients, template name, and data are required' },
            { status: 400 }
          );
        }

        const templateResult = await sendEmail(recipients, templateName, data);
        return NextResponse.json({
          message: 'Template email sent successfully',
          result: templateResult
        });

      case 'bulk':
        // Send bulk emails
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
          return NextResponse.json(
            { error: 'Recipients array is required' },
            { status: 400 }
          );
        }

        if (!templateName || !data) {
          return NextResponse.json(
            { error: 'Template name and data are required' },
            { status: 400 }
          );
        }

        const bulkResults = await sendBulkEmail(recipients, templateName, data);
        const successCount = bulkResults.filter(r => r.success).length;
        const failureCount = bulkResults.length - successCount;

        return NextResponse.json({
          message: `Bulk email completed: ${successCount} sent, ${failureCount} failed`,
          results: bulkResults,
          summary: {
            total: bulkResults.length,
            success: successCount,
            failed: failureCount
          }
        });

      case 'newsletter':
        // Send newsletter to all subscribed users
        const subscribedUsers = await User.find({
          newsletter: true,
          isActive: true
        }).select('email firstName lastName');

        if (subscribedUsers.length === 0) {
          return NextResponse.json({
            message: 'No subscribed users found'
          });
        }

        const newsletterData = {
          subject: subject || 'Newsletter from Surprise Tokri',
          content: message || 'Thank you for subscribing to our newsletter!'
        };

        const newsletterResults = await sendBulkEmail(
          subscribedUsers.map(user => user.email),
          'newsletter', // You'd need to create this template
          newsletterData
        );

        const newsletterSuccess = newsletterResults.filter(r => r.success).length;

        return NextResponse.json({
          message: `Newsletter sent to ${newsletterSuccess} out of ${subscribedUsers.length} subscribers`,
          results: newsletterResults
        });

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

// GET - Get email statistics and connection status
export async function GET(request) {
  try {
    await connectDB();
    
    // Check admin authorization
    const authResult = await requireAdmin(request);
    if (authResult) {
      return authResult;
    }

    // Test email connection
    const connectionStatus = await testEmailConnection();

    // Get email statistics (you could track these in a separate model)
    const stats = {
      connection: connectionStatus,
      configuration: {
        host: process.env.SMTP_HOST || 'Not configured',
        port: process.env.SMTP_PORT || 'Not configured',
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || 'Not configured',
        fromName: process.env.SMTP_FROM_NAME || 'Surprise Tokri',
        fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'Not configured'
      },
      subscribers: {
        newsletter: await User.countDocuments({ newsletter: true }),
        marketing: await User.countDocuments({ marketing: true }),
        total: await User.countDocuments({ isActive: true })
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get email stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get email statistics' },
      { status: 500 }
    );
  }
}