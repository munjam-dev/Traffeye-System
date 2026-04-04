import { NextResponse } from 'next/server';

// Mock specific violation API
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const violations = [
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
      confidenceScore: 0.95,
      evidence: {
        boundingBoxes: [
          {
            x: 100, y: 150, width: 200, height: 300,
            label: 'motorcycle', confidence: 0.95
          },
          {
            x: 120, y: 180, width: 80, height: 100,
            label: 'no_helmet', confidence: 0.92
          }
        ],
        metadata: {
          frameNumber: 1250, timestamp: 1649076625,
          weather: 'clear', lighting: 'daylight'
        }
      }
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
      confidenceScore: 0.88,
      evidence: {
        boundingBoxes: [
          {
            x: 80, y: 120, width: 250, height: 350,
            label: 'motorcycle', confidence: 0.96
          },
          {
            x: 90, y: 140, width: 60, height: 80,
            label: 'person', confidence: 0.91
          },
          {
            x: 140, y: 145, width: 60, height: 80,
            label: 'person', confidence: 0.89
          },
          {
            x: 190, y: 150, width: 60, height: 80,
            label: 'person', confidence: 0.87
          }
        ],
        metadata: {
          frameNumber: 1345, timestamp: 1649076675,
          weather: 'partly_cloudy', lighting: 'daylight'
        }
      }
    }
  ];

  const violation = violations.find(v => v.id === params.id);
  
  if (!violation) {
    return NextResponse.json(
      { error: 'Violation not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(violation);
}
