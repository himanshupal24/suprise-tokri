import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Influencer from '@/models/Influencer';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      socialMediaPlatforms, 
      followers, 
      engagementRate, 
      contentType, 
      message 
    } = body;

    // Validate required fields
    if (!name || !email || !socialMediaPlatforms || !followers || !contentType) {
      return NextResponse.json(
        { error: 'Name, email, social media platforms, followers, and content type are required' },
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

    // Validate followers count
    if (followers < 1000) {
      return NextResponse.json(
        { error: 'Minimum 1,000 followers required to apply' },
        { status: 400 }
      );
    }

    // Save to DB as pending influencer
    const platform = Array.isArray(socialMediaPlatforms) ? socialMediaPlatforms[0] : socialMediaPlatforms;
    const followersNumber = typeof followers === 'string' ? parseInt(String(followers).replace(/[^0-9]/g, ''), 10) : Number(followers);
    const engagementRate = typeof engagementRate === 'string' ? parseFloat(String(engagementRate).replace(/[^0-9.]/g, '')) : Number(engagementRate);

    const influencer = new Influencer({
      name,
      email,
      phone,
      platform: platform || 'Other',
      followersNumber: isNaN(followersNumber) ? 0 : followersNumber,
      engagementRate: isNaN(engagementRate) ? 0 : engagementRate,
      category: contentType,
      status: 'pending',
      bio: message,
    });

    await influencer.save();

    return NextResponse.json({
      message: 'Thank you! Your application has been received.',
      success: true,
      data: { id: influencer._id }
    }, { status: 201 });

  } catch (error) {
    console.error('Influencer application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit influencer application' },
      { status: 500 }
    );
  }
} 