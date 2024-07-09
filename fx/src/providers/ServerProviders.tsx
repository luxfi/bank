import { AuthSession } from '@/components/AuthSession';

import { useAuth } from '@/store/useAuth';

export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkUser = useAuth.getState().setCheckAuthenticatedUser;

  const user = await checkUser();

  return <AuthSession user={user}>{children}</AuthSession>;
}
