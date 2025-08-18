import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // In a real application, you would:
    // 1. Send email with reset link
    // 2. Use a proper email service like SendGrid, AWS SES, etc.
    // 3. Include the reset token in the email link
    
    console.log('Password reset requested for:', email);
    console.log('Reset token:', resetToken);
    console.log('Reset link would be:', `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`);

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 