import { NextRequest } from 'next/server';

import { getBeneficiaryCurrenciesList } from '@/api/beneficiaries';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    if (!searchParams.has('currencyCode')) {
      return Response.json({
        statusCode: 404,
        data: null,
        message: 'Currency code not found',
      });
    }

    const currencyCode = searchParams.get('currencyCode') ?? '';

    const response = await getBeneficiaryCurrenciesList(currencyCode, true);

    const { statusCode, data, message } = response;

    return Response.json({
      statusCode: statusCode,
      data: data ?? [],
      message: message ?? '',
    });
  } catch (error) {
    console.error('Failed to fetch Beneficiaries:', error);

    return Response.json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
