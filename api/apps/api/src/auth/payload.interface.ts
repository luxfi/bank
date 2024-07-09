export interface PayloadInterface {
  username: string;
  mobileNumber?: string;
  twoFA: boolean;
  clientUUID?: string;
  role: string;
  personatedBy?: string;
}
