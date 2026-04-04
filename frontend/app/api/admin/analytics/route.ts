import { NextResponse } from 'next/server';

// Mock admin analytics API
export async function GET() {
  return NextResponse.json({
    daily_violations: [
      { date: '2024-04-01', count: 5 },
      { date: '2024-04-02', count: 8 },
      { date: '2024-04-03', count: 6 },
      { date: '2024-04-04', count: 12 }
    ],
    peak_hours: [
      { hour: 8, count: 15 },
      { hour: 12, count: 25 },
      { hour: 18, count: 20 }
    ],
    location_heatmap: [
      { latitude: 19.0760, longitude: 72.8777, count: 5 },
      { latitude: 19.0850, longitude: 72.8850, count: 3 }
    ],
    violation_categories: {
      no_helmet: 1,
      triple_riding: 1,
      signal_violation: 0
    }
  });
}
