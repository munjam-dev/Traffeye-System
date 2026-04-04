import { NextResponse } from 'next/server';

// Mock users API
export async function GET() {
  return NextResponse.json({
    success: true,
    count: 1,
    data: [
      {
        id: '1',
        name: 'Demo User',
        email: 'demo@traffeye.com',
        phone: '+91 9876543210',
        vehicles: ['MH12AB1234', 'MH15CD5678'],
        role: 'user',
        isActive: true,
        profilePicture: null,
        createdAt: '2024-01-15T10:30:00.000Z',
        lastLogin: '2024-04-04T14:25:00.000Z'
      }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: 'User created successfully',
    data: {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
      isActive: true,
      role: 'user'
    }
  });
}
