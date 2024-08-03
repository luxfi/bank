import { Badge } from '@/components/Badge';
import { DetailsCardTemplate } from '@/components/DetailsCardTemplate';
import { UserAvatar } from '@/components/UserAvatar';

import { TUserStatus } from '@/models/users';

import { getUserStatusBadgeValues } from '@/utils/valueMaps';

import { CountriesList } from '@/lib/constants';

import { Column, Row, Text, useTheme } from '@cdaxfx/ui';

import { userRolesDictionary } from '../types';

interface IUserDetailsProps {
  name: string;
  email: string;
  phone: string;
  country?: string;
  role?: string;
  status?: TUserStatus;
}
export function UserDetailsCard({
  name,
  email,
  phone,
  country,
  role,
  status,
}: IUserDetailsProps) {
  const { theme } = useTheme();

  const textSecondary = theme.textColor.layout.secondary.value;

  const getInitials = (name: string) => {
    const nameSplit = name.split(' ');
    if (nameSplit.length > 1) {
      return `${nameSplit[0][0]}${nameSplit[1][0]}`;
    }
    return nameSplit[0][0];
  };

  return (
    <Column width="640px">
      <DetailsCardTemplate.Container>
        <DetailsCardTemplate.CardHeader>
          <Row>
            <UserAvatar
              name={name}
              initials={getInitials(name)}
              username={email}
            />
          </Row>
        </DetailsCardTemplate.CardHeader>
        <DetailsCardTemplate.CardBody>
          <Column gap="xxs" width="100%">
            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Email
              </Text>
              <Text variant="body_md_regular">{email || '--'}</Text>
            </Column>
            {country && (
              <Column>
                <Text variant="caption_regular" color={textSecondary}>
                  Country
                </Text>
                <Text variant="body_md_regular">
                  {CountriesList.get(country) || country || '--'}
                </Text>
              </Column>
            )}
            <Column>
              <Text variant="caption_regular" color={textSecondary}>
                Phone number
              </Text>
              <Text variant="body_md_regular">{phone ? `${phone}` : '--'}</Text>
            </Column>
            {role && (
              <Column>
                <Text variant="caption_regular" color={textSecondary}>
                  Role
                </Text>
                <Text variant="body_md_regular">
                  {role ? userRolesDictionary[role] : '--'}
                </Text>
              </Column>
            )}
            {status && (
              <Column>
                <Text variant="caption_regular" color={textSecondary}>
                  Status
                </Text>
                <Badge
                  type="dot"
                  label={getUserStatusBadgeValues[status].label}
                  variant={getUserStatusBadgeValues[status].variant}
                />
              </Column>
            )}
          </Column>
        </DetailsCardTemplate.CardBody>
      </DetailsCardTemplate.Container>
    </Column>
  );
}
