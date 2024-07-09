'use client';

import { Provider } from '@/context/Clients';

const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export default ClientsProvider;
