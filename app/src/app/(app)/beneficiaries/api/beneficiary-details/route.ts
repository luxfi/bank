import { NextRequest, NextResponse } from 'next/server';

import { getBeneficiaryDetails } from '@/api/beneficiaries';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const response = await getBeneficiaryDetails(
      searchParams.get('id') ?? '',
      true
    );

    const { statusCode, data, message } = response;

    return new NextResponse(
      JSON.stringify({
        statusCode: statusCode,
        data: data ?? [],
        message: message ?? '',
      }),
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch Beneficiary:', error);

    return new NextResponse(
      JSON.stringify({
        statusCode: 500,
        message: 'Internal Server Error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
