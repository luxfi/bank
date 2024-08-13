import { NextRequest } from 'next/server'

import { determineDeviceMW } from '@luxfi/ui/next'

export const middleware = 
  async (request: NextRequest) => (determineDeviceMW(request))