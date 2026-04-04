import { NextResponse } from 'next/server';

// Mock data for immediate Vercel deployment
export async function GET() {
  return NextResponse.json({
    message: 'TraffEye Mock API - Working!',
    timestamp: new Date().toISOString(),
    data: {
      violations: [
        {
          id: '1',
          vehicleNumber: 'MH12AB1234',
          violationType: 'no_helmet',
          date: '2024-04-04',
          time: '14:30:25',
          location: 'Main Street & 5th Avenue',
          latitude: 19.0760,
          longitude: 72.8777,
          imageUrl: '/violations/sample1.jpg',
          fineAmount: 500,
          status: 'unpaid',
          confidenceScore: 0.95
        },
        {
          id: '2',
          vehicleNumber: 'MH15CD5678',
          violationType: 'triple_riding',
          date: '2024-04-04',
          time: '14:31:15',
          location: 'Highway 20, Exit 15',
          latitude: 19.0850,
          longitude: 72.8850,
          imageUrl: '/violations/sample2.jpg',
          fineAmount: 1000,
          status: 'unpaid',
          confidenceScore: 0.88
        }
      ],
      users: [
        {
          id: '1',
          name: 'Demo User',
          email: 'demo@traffeye.com',
          vehicles: ['MH12AB1234'],
          role: 'user'
        }
      ],
      cameras: [
        {
          id: '1',
          cameraId: 'CAM001',
          location: 'Main Street & 5th Avenue',
          latitude: 19.0760,
          longitude: 72.8777,
          status: 'active'
        }
      ],
      stats: {
        totalViolations: 2,
        helmetViolations: 1,
        tripleRiding: 1,
        signalViolations: 0,
        paidChallans: 0,
        unpaidChallans: 2
      }
    }
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: 'Mock API POST - Working!',
    received: body,
    timestamp: new Date().toISOString()
  });
}
