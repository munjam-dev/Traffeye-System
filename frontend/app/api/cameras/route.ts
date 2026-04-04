import { NextResponse } from 'next/server';

// Mock cameras API
export async function GET() {
  return NextResponse.json({
    success: true,
    count: 2,
    data: [
      {
        id: '1',
        cameraId: 'CAM001',
        location: 'Main Street & 5th Avenue',
        latitude: 19.0760,
        longitude: 72.8777,
        status: 'active',
        cameraType: 'traffic',
        resolution: {
          width: 1920,
          height: 1080
        },
        fps: 30,
        ipAddress: '192.168.1.100',
        rtspUrl: 'rtsp://192.168.1.100:554/stream',
        detectionZones: [
          {
            name: 'Main Lane',
            coordinates: [
              { x: 100, y: 200 },
              { x: 800, y: 200 },
              { x: 800, y: 600 },
              { x: 100, y: 600 }
            ],
            isActive: true
          }
        ],
        aiConfig: {
          helmetDetection: {
            enabled: true,
            confidence: 0.7
          },
          tripleRidingDetection: {
            enabled: true,
            confidence: 0.8
          },
          signalViolationDetection: {
            enabled: true,
            confidence: 0.9
          }
        },
        statistics: {
          totalDetections: 150,
          totalViolations: 45,
          avgConfidence: 0.85,
          lastDetection: new Date().toISOString()
        }
      },
      {
        id: '2',
        cameraId: 'CAM002',
        location: 'Highway 20, Exit 15',
        latitude: 19.0850,
        longitude: 72.8850,
        status: 'active',
        cameraType: 'speed',
        resolution: {
          width: 1920,
          height: 1080
        },
        fps: 30,
        ipAddress: '192.168.1.101',
        rtspUrl: 'rtsp://192.168.1.101:554/stream',
        detectionZones: [
          {
            name: 'Speed Lane',
            coordinates: [
              { x: 150, y: 250 },
              { x: 900, y: 250 },
              { x: 900, y: 650 },
              { x: 150, y: 650 }
            ],
            isActive: true
          }
        ],
        aiConfig: {
          helmetDetection: {
            enabled: true,
            confidence: 0.7
          },
          tripleRidingDetection: {
            enabled: true,
            confidence: 0.8
          },
          signalViolationDetection: {
            enabled: false,
            confidence: 0.9
          }
        },
        statistics: {
          totalDetections: 200,
          totalViolations: 60,
          avgConfidence: 0.82,
          lastDetection: new Date().toISOString()
        }
      }
    ]
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: 'Camera added successfully',
    data: {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  });
}
