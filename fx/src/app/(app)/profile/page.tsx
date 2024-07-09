'use client';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';

import Admin from './Components/Admin';
import SuperAdmin from './Components/SuperAdmin';

export default function Profile() {
  const { currentUser } = useAuth();

  const render: Record<UserRole, React.ReactNode> = {
    'admin:super': <SuperAdmin />,
    'user:admin': <Admin />,
    'user:manager': <Admin />,
    'user:member': <Admin />,
    'user:viewer': <></>,
  };

  return render[currentUser?.role ?? UserRole.TeamMember];
}
