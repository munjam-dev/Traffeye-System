import { NextResponse } from 'next/server';

// Mock offline cameras API
export async function GET() {
  return NextResponse.json({
    success: true,
    count: 0,
    data: [],
    message: 'All cameras are online and functioning properly'
  });
}
