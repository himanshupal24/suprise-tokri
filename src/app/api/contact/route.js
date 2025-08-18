import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, subject, message, category } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Store contact inquiry (you can create a Contact model if needed)
    // For now, we'll just log it and return success
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      subject,
      message,
      category,
      timestamp: new Date().toISOString()
    });

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to customer

    return NextResponse.json({
      message: 'Thank you for your message! We will get back to you soon.',
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 