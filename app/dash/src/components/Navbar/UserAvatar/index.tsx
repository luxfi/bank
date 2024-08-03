import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Tooltip } from '@/components/Tooltip';

import { useAuth } from '@/store/useAuth';
import { Text } from '@luxbank/ui';

import { AvatarPlaceholder, Container } from './styles';

interface IUserAvatar {
  sidebarOpen?: boolean;
}
export function UserAvatar({ sidebarOpen = false }: IUserAvatar) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const user = useMemo(() => {
    return {
      name: `${currentUser?.firstname || '--'} ${currentUser?.lastname || ''}`,
      initials: `${currentUser?.firstname[0] || '--'}${
        currentUser?.lastname[0] || ''
      }`,
    };
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <Tooltip title={!sidebarOpen ? user.name : ''} placement="right">
      <Container
        $sidebarOpen={sidebarOpen}
        onClick={() => {
          router.push('/users/profile');
        }}
      >
        <AvatarPlaceholder>
          <Text variant="body_md_bold">{user.initials || ''}</Text>
        </AvatarPlaceholder>
        <Text variant="body_sm_regular">{user.name || ''}</Text>
      </Container>
    </Tooltip>
  );
}
