import { ECurrencyCode } from '@tools/misc';
import { TransactionStatusResumed } from '@tools/models';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import * as dayjs from 'dayjs';

enum EDateField {
  SETTLEMENT_AT = 'settlementAt',
  CREATED_AT = 'createdAt',
  COMPLETED_AT = 'completedAt',
}

export class ListTransactionsRequestDto {
  @IsEnum(TransactionStatusResumed)
  @IsOptional()
  status?: TransactionStatusResumed;

  statusApproval?: string;

  @IsEnum(EDateField)
  @IsOptional()
  dateField?: EDateField;

  @Transform(({ value }) => dayjs(value).startOf('day').toDate())
  startDate?: Date;

  @Transform(({ value }) => dayjs(value).endOf('day').toDate())
  endDate?: Date;

  beneficiary?: string;

  @IsEnum(ECurrencyCode)
  @IsOptional()
  currency?: ECurrencyCode;

  minAmount?: string;
  maxAmount?: string;
  client?: string;
  type?: string;
  reference?: string;
  account?: string;
  gateway?: string;
  cdaxId?: string;
  page?: number;
  limit?: number;

  @IsOptional()
  orderBy?: 'in' | 'out' | 'type' | 'status' | 'date' | 'creator' | 'id';

  @IsOptional()
  order?: 'asc' | 'desc';
}
