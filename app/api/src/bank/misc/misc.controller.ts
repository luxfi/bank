import { Controller, Get } from '@nestjs/common';
import { ListCountriesResponseDto } from './dto/list-countries.response.dto';
import { ListCurrenciesResponseDto } from './dto/list-currencies.response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { COUNTRY_NAME, ECurrencyCode } from '@luxbank/tools-misc';
import { CurrenciesName } from '@luxbank/tools-models';

@ApiTags('Misc')
@ApiBearerAuth()
@Controller({path: 'misc', version: '2'})
export class MiscController {
    @Get('countries')
    async findAll(): Promise<ListCountriesResponseDto> {
        return {
            data: Object.entries(COUNTRY_NAME).map(([code, name]) => ({
                code,
                name
            }))
        };
    }

    @Get('currencies')
    async findAllCurrencies(): Promise<ListCurrenciesResponseDto> {
        return {
            data: Object.entries(ECurrencyCode).map(([code]) => ({
                code,
                name: CurrenciesName[code]?.name ?? code
            }))
        };
    }
}
