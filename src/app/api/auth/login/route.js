import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { generateToken, validateEmail } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password, loginMethod = 'email' } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user;
    
    // Find user by email or phone
    if (loginMethod === 'email') {
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400 }
        );
      }
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      // Phone login
      user = await User.findOne({ phone: email });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tier: user.tier,
        rewardsPoints: user.rewardsPoints,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        memberSince: user.memberSince,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 