import { NextResponse } from 'next/server';

// Mock statistics API
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      database: {
        db: 'traffeye',
        collections: 3,
        views: 0,
        objects: 3,
        avgObjSize: 202.67,
        dataSize: 608,
        storageSize: 12288,
        indexes: 3,
        indexSize: 12288,
        totalSize: 24576,
        scaleFactor: 1,
        ok: 1
      },
      collections: {
        users: 1,
        violations: 2,
        cameras: 1
      },
      collectionCount: 3,
      timestamp: new Date().toISOString()
    }
  });
}
