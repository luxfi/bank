'use client';

import { Provider } from '@/context/Notification';

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export default NotificationProvider;
