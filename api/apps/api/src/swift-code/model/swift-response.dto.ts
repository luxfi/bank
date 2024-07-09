export interface SwiftData {
  id: string;
  address: string;
  postcode: string;
  branch_name: string;
  branch_code: string;

  country: {
    id: string;
    name: string;
  };

  city: {
    id: string;
    country_id: string;
    name: string;
  };

  bank: {
    id: string;
    country_id: string;
    code: string;
    name: string;
  };
}

export interface SwiftResponseDto {
  success: boolean;
  data: SwiftData;
}
