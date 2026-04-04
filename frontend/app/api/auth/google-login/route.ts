import { NextResponse } from 'next/server';

// Mock Google OAuth login API
export async function POST() {
  return NextResponse.json({
    access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
    user: {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: 'Demo User',
      email: 'demo@traffeye.com',
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      vehicles: ['MH12AB1234', 'MH15CD5678']
    }
  });
}
