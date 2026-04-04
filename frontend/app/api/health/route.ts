import { NextResponse } from 'next/server';

// Mock health check API
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      status: 'healthy',
      message: 'Database connection is working (Mock)',
      details: {
        state: 'connected',
        host: 'localhost',
        port: 27017,
        name: 'traffeye'
      }
    },
    connection: {
      state: 'connected',
      host: 'localhost',
      port: 27017,
      name: 'traffeye'
    },
    uptime: Math.floor(Math.random() * 10000),
    version: '1.0.0',
    environment: 'production'
  });
}
