import { NextResponse } from 'next/server';

// Mock add vehicle API
export async function POST(request: Request) {
  const body = await request.json();
  const vehicleNumber = body.vehicleNumber || 'MH99XX9999';
  
  return NextResponse.json({
    message: `Vehicle ${vehicleNumber} added successfully`,
    vehicle: {
      id: 'vehicle_' + Math.random().toString(36).substr(2, 9),
      vehicleNumber: vehicleNumber.toUpperCase(),
      type: 'motorcycle',
      registeredAt: new Date().toISOString()
    }
  });
}
