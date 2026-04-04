import { NextResponse } from 'next/server';

// Mock violation statistics API
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        _id: null,
        totalViolations: 2,
        unpaidViolations: 2,
        paidViolations: 0,
        totalFines: 1500,
        collectedFines: 0,
        violationTypes: ['no_helmet', 'triple_riding']
      }
    ]
  });
}
