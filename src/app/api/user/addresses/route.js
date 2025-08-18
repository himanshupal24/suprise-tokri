import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Address from '../../../../models/Address.js';
import { verifyToken } from '../../../../lib/auth.js';

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const addresses = await Address.find({ user: decoded.userId }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      addresses: addresses.map(address => ({
        id: address._id,
        type: address.type,
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        isDefault: address.isDefault,
        createdAt: address.createdAt
      }))
    });

  } catch (error) {
    console.error('Addresses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, 
      name, 
      phone, 
      address, 
      city, 
      state, 
      pincode, 
      landmark, 
      isDefault 
    } = body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (isDefault) {
      await Address.updateMany(
        { user: decoded.userId, isDefault: true },
        { isDefault: false }
      );
    }

    const newAddress = new Address({
      user: decoded.userId,
      type: type || 'Home',
      name,
      phone,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault: isDefault || false
    });

    await newAddress.save();

    return NextResponse.json({
      message: 'Address added successfully',
      address: {
        id: newAddress._id,
        type: newAddress.type,
        name: newAddress.name,
        phone: newAddress.phone,
        address: newAddress.address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        landmark: newAddress.landmark,
        isDefault: newAddress.isDefault,
        createdAt: newAddress.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Address creation error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}
