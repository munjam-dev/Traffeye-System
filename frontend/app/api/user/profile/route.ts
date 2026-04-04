import { NextResponse } from 'next/server';

// Mock user profile API
export async function GET() {
  return NextResponse.json({
    id: 'user_demo',
    name: 'Demo User',
    email: 'demo@traffeye.com',
    picture: 'https://lh3.googleusercontent.com/a/default-user',
    vehicles: ['MH12AB1234', 'MH15CD5678'],
    role: 'user',
    createdAt: '2024-01-15T10:30:00.000Z',
    lastLogin: '2024-04-04T14:25:00.000Z'
  });
}
