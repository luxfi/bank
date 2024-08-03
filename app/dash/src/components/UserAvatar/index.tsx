import { userRolesDictionary } from '@/app/(app)/users/types';
import { Column, Row, Text, useTheme } from '@luxbank/ui';
import styled from 'styled-components';

import { Divider } from '../Divider';

interface IUserAvatar {
  name: string;
  initials: string;
  username?: string;
  role?: string;
  showLabels?: boolean;
}
export const UserAvatar = ({
  name,
  initials,
  username,
  role,
  showLabels,
}: IUserAvatar) => {
  const { theme } = useTheme();

  return (
    <Row gap="xs" align="center">
      <AvatarContainer>
        <Text
          variant="body_md_semibold"
          color={theme.textColor.interactive['default-inverse'].value}
        >
          {initials || '--'}
        </Text>
      </AvatarContainer>
      <Column>
        {showLabels && (
          <Text
            variant="caption_regular"
            color={theme.textColor.layout.secondary.value}
          >
            Name
          </Text>
        )}
        <Text variant="headline_semibold">{name || '--'}</Text>
        {username && (
          <Text
            variant="body_md_regular"
            color={theme.textColor.layout.secondary.value}
          >
            {username}
          </Text>
        )}
      </Column>
      {role && (
        <>
          <Divider
            orientation="vertical"
            styles={{ height: '40px', marginInline: '4px' }}
          />
          <Column>
            {showLabels && (
              <Text
                variant="caption_regular"
                color={theme.textColor.layout.secondary.value}
              >
                Role
              </Text>
            )}
            <Text variant="body_md_semibold">
              {userRolesDictionary[role] ?? '--'}
            </Text>
          </Column>
        </>
      )}
    </Row>
  );
};

const AvatarContainer = styled.div`
  width: ${(props) => props.theme.width.xl.value};
  height: ${(props) => props.theme.width.xl.value};
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  background-color: ${(props) =>
    props.theme.backgroundColor.interactive['primary-default'].value};
  display: flex;
  align-items: center;
  justify-content: center;
`;
