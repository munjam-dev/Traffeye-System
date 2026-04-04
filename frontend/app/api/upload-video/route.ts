import { NextResponse } from 'next/server';

// Mock video upload API
export async function POST() {
  return NextResponse.json({
    video_id: 'video_' + Math.random().toString(36).substr(2, 9),
    status: 'processing',
    message: 'Video uploaded successfully. AI processing started.',
    processing_time: '30-60 seconds',
    estimated_violations: Math.floor(Math.random() * 5) + 1
  });
}
