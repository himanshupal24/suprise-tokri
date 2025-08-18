  import { NextResponse } from 'next/server';
  import connectDB from '../../../../lib/db.js';
  import User from '../../../../models/User.js';
  import { generateToken, validatePassword, validateEmail, validatePhone } from '../../../../lib/auth.js';

  export async function POST(request) {
    try {
      await connectDB();
      
      const body = await request.json();
      console.log('Request Body:', body);
     
      const { firstName, lastName, email, phone, password, dateOfBirth, gender, address, city, state, pincode, newsletter, marketing } = body;

      // Validation
      if (!firstName || !lastName || !email || !phone || !password) {
        return NextResponse.json(
          { error: 'All required fields must be provided' },
          { status: 400 }
        );
      }

      // Email validation
      if (!validateEmail(email)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address' },
          { status: 400 }
        );
      }

      // Phone validation
      if (!validatePhone(phone)) {
        return NextResponse.json(
          { error: 'Please provide a valid Indian phone number' },
          { status: 400 }
        );
      }

      // Password validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: 'Password validation failed', details: passwordValidation.errors },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email: email.toLowerCase() }, { phone }] 
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email or phone number already exists' },
          { status: 409 }
        );
      }

      // Create new user
      const user = new User({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        password,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        newsletter: newsletter !== undefined ? newsletter : true,
        marketing: marketing !== undefined ? marketing : false
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return NextResponse.json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          tier: user.tier,
          rewardsPoints: user.rewardsPoints,
          memberSince: user.memberSince
        },
        token
      }, { status: 201 });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 11000) {
        return NextResponse.json(
          { error: 'User with this email or phone number already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 500 }
      );
    }
  } 