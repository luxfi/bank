import React from 'react'
import { Footer, Main } from '@luxfi/ui'

import siteDef from '../site-def'
import { HomeLayout } from '@/layout'

const UniversalPage = () => (<>
  <Main className='md:flex-row md:gap-4 !px-0 !max-w-full'>
    <HomeLayout />
  </Main>
  <Footer siteDef={siteDef} className='w-full pt-16 lg:mx-auto ' />
</>)

export default UniversalPage
