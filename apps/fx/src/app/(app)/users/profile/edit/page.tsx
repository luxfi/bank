'use client';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';

import { Admin } from './Pages/Admin';
import { SuperAdmin } from './Pages/SuperAdmin';

export default function MyProfileEdit() {
  const { currentUser } = useAuth();

  const render: Record<UserRole, React.ReactNode> = {
    'admin:super': <SuperAdmin />,
    'user:admin': <Admin />,
    'user:manager': <Admin />,
    'user:member': <Admin />,
    'user:viewer': <Admin />,
  };

  return render[currentUser?.role ?? UserRole.ViewerUser];
}
