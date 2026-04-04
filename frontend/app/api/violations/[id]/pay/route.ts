import { NextResponse } from 'next/server';

// Mock violation payment API
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    message: 'Challan marked as paid successfully',
    violationId: params.id,
    status: 'paid',
    paidAt: new Date().toISOString(),
    paymentId: 'pay_' + Math.random().toString(36).substr(2, 9)
  });
}
