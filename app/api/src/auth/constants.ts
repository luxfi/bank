import { LUX_BRAND } from '@luxbank/brand';

export const JwtConstants = {
    Secret: process.env.JWT_SECRET,
    Issuer: LUX_BRAND.domains.primary
};
