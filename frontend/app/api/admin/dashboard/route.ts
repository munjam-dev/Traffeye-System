import { NextResponse } from 'next/server';

// Mock admin dashboard API
export async function GET() {
  return NextResponse.json({
    total_violations: 2,
    helmet_violations: 1,
    triple_riding: 1,
    signal_violations: 0,
    paid_challans: 0,
    unpaid_challans: 2
  });
}
