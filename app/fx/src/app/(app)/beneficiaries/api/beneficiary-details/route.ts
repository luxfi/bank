import { NextRequest } from 'next/server';

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

    return Response.json({
      statusCode: statusCode,
      data: data ?? [],
      message: message ?? '',
    });
  } catch (error) {
    console.error('Failed to fetch Beneficiary:', error);

    return Response.json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
