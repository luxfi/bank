import { SwiftData } from './swift-response.dto';

export interface IbanResponseDto {
  success: boolean;
  data: {
    id: string;
    account_number: string;
    national_bank_code: string;
    national_branch_code: string;
    swift: SwiftData;
    country: {
      id: string;
      name: string;
    };
  };
}
