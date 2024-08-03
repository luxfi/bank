'use client';

import { useEffect } from 'react';

import { ICurrentUser } from '@/models/auth';

import { useAuth } from '@/store/useAuth';

interface IProps {
  children: React.ReactNode;
  user: ICurrentUser | null;
}

export const AuthSession: React.FC<IProps> = ({ children, user }) => {
  const { setUser, setClearUser } = useAuth();

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      setClearUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
