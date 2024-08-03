import { NextRequest } from 'next/server';

import { createPayment } from '@/api/payment';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const accountId = searchParams.get('accountId') ?? '';
    const amount = searchParams.get('amount') ?? '';
    const beneficiaryId = searchParams.get('beneficiaryId') ?? '';
    const currency = searchParams.get('currency') ?? '';
    const date = searchParams.get('date') ?? '';
    const purposeCode = searchParams.get('purposeCode') ?? '';
    const reason = searchParams.get('reason') ?? '';
    const reference = searchParams.get('reference') ?? '';
    const type = searchParams.get('type') ?? '';

    const response = await createPayment(
      {
        accountId,
        amount: Number(amount),
        beneficiaryId,
        currency,
        date,
        purposeCode,
        reason,
        reference,
        type,
      },
      true
    );

    const { statusCode, data, message } = response;

    return Response.json({
      statusCode: statusCode,
      data: data ?? [],
      message: message,
    });
  } catch (error) {
    console.error('Failed to fetch Create Payment:', error);

    return Response.json({
      statusCode: 500,
      message: error,
    });
  }
}
