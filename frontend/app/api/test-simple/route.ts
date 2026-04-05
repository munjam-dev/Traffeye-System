import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: '✅ TraffEye API is working!',
    status: 'success',
    timestamp: new Date().toISOString(),
    features: [
      'AI Detection',
      'Multi-language Support',
      'Real-time Monitoring',
      'Analytics Dashboard'
    ]
  })
}
