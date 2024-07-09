import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { SuccessResponseV2 } from '@tools/misc';

export const ApiOkResponsePaginated = <DataDto extends Type<any>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseV2),
    ApiOkResponsePaginated({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseV2) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    } as any),
  );
