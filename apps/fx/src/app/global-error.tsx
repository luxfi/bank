'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useNotification } from '@/context/Notification';

export default function GlobalError({ error }: { error: Error }) {
  const router = useRouter();
  const { onShowNotification } = useNotification();

  useEffect(() => {
    onShowNotification({
      type: 'ERROR',
      message: 'Something went wrong',
      description: error.message,
    });
  }, [error.message, onShowNotification]);

  return router.push('/');
}
