// /api/user/addresses/[id]/route.js

import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db';
import Address from '../../../../../models/Address';
import { verifyToken } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { id } = await params;
    const addressId = id;
    const body = await request.json();

    const existingAddress = await Address.findOne({ _id: addressId, user: decoded.userId });
    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    if (body.isDefault) {
      await Address.updateMany(
        { user: decoded.userId, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(existingAddress, {
      type: body.type || existingAddress.type,
      name: body.name,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      landmark: body.landmark,
      isDefault: body.isDefault || false,
    });

    await existingAddress.save();

    return NextResponse.json({
      message: 'Address updated successfully',
      address: {
        id: existingAddress._id,
        type: existingAddress.type,
        name: existingAddress.name,
        phone: existingAddress.phone,
        address: existingAddress.address,
        city: existingAddress.city,
        state: existingAddress.state,
        pincode: existingAddress.pincode,
        landmark: existingAddress.landmark,
        isDefault: existingAddress.isDefault,
        createdAt: existingAddress.createdAt
      }
    });

  } catch (err) {
    console.error('Update address error:', err);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { id } = await params;
    const addressId = id;

    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      user: decoded.userId
    });

    if (!deleted) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Address deleted successfully' });

  } catch (err) {
    console.error('Delete address error:', err);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
