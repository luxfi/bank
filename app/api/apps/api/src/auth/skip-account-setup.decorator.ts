import { SetMetadata } from '@nestjs/common';

export const SKIP_ACCOUNT_SETUP_KEY = 'skip-account-setup-key';
export const SkipAccountSetup = () => SetMetadata(SKIP_ACCOUNT_SETUP_KEY, true);
