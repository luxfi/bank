'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useState } from 'react';

import { Tooltip } from '@/components/Tooltip';

import { UserRole } from '@/models/auth';

import { useSidebar } from '@/context/useSidebar';

import { validatePaths } from '@/utils/pathPermissions';

import { APP_PATHS } from '@/app/paths';
import { useAuth } from '@/store/useAuth';
import { useTransactions } from '@/store/useTransactions';
import { MenuOutlined } from '@ant-design/icons';
import {
  Column,
  IIconProps,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import {
  ContentContainer,
  Divider,
  ExpandButton,
  ExpandButtonContainer,
  FooterContainer,
  NavbarItem as Item,
  MainContainer,
  MenuContainer,
  MenuItem,
} from './styles';
import { UserAvatar } from './UserAvatar';

interface INavbarItem {
  icon: IIconProps['variant'];
  label: string;
  path: string;
  external?: boolean;
  badge?: number;
}

function getNavbarItems(inApprovalCount: number) {
  const navbarItems: Array<INavbarItem> = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: 'wallet',
      label: 'Wallet',
      path: '/wallet',
    },
    {
      icon: 'notebook-1',
      label: 'Clients',
      path: '/clients',
    },
    {
      icon: 'case-minimalistic',
      label: 'Beneficiaries',
      path: '/beneficiaries',
    },
    {
      icon: 'hand-money',
      label: 'Create Payment',
      path: '/create-payment',
    },
    {
      icon: 'sort-vertical',
      label: 'Conversion',
      path: '/conversion',
    },
    {
      icon: 'history',
      label: 'In Approval',
      path: APP_PATHS.IN_APPROVAL.ROOT,
      badge: inApprovalCount,
    },
    {
      icon: 'magnifer',
      label: 'Transactions',
      path: '/transactions',
    },
    {
      icon: 'user',
      label: 'Users',
      path: '/users',
    },
  ];

  return navbarItems;
}

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();

  const { isOpen, toggleSidebar } = useSidebar();
  const { theme } = useTheme();
  const { inApprovalCount, setApprovalCount } = useTransactions();

  const { currentUser, setSignOut } = useAuth();

  const [showNavbar, setShowNavbar] = useState<boolean>(true);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowNavbar(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showNavbar]);

  useEffect(() => {
    const rootElement = document.documentElement as HTMLElement;

    rootElement.style.setProperty('--menu-state', isOpen ? 'open' : 'close');
  }, [isOpen]);

  useEffect(() => {
    if (inApprovalCount === 0) {
      setApprovalCount();
    }
  }, [inApprovalCount, setApprovalCount]);

  const NavbarItem = ({ item }: { item: INavbarItem }) => {
    return (
      <Tooltip title={!isOpen ? item.label : undefined} placement="right">
        <Item
          $active={`${window.location.host}${path}`.includes(
            `${window.location.host}${item.path}`
          )}
          $show={showNavbar}
          $expanded={isOpen}
          $badgeValue={item.badge}
          onClick={() => {
            if (item.external) {
              const win = window.open(item.path, '_blank');
              if (win) win.focus();
              return;
            }

            if (item.label === 'Log Out') {
              return setSignOut();
            }

            router.push(item.path);
          }}
        >
          <Row justify="center" align="center" gap="xxs">
            <Icon variant={item.icon} size="md" />
            <Text variant="body_sm_regular">{item.label}</Text>
          </Row>
        </Item>
      </Tooltip>
    );
  };

  return (
    <Suspense>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 'fit-content',
        }}
      >
        <MenuContainer $show={showNavbar}>
          <MenuItem
            $show={showNavbar}
            onClick={() => {
              setShowNavbar(!showNavbar);
            }}
          >
            <MenuOutlined />
            Menu
          </MenuItem>
        </MenuContainer>

        <MainContainer>
          <ContentContainer $show={showNavbar} $expanded={isOpen}>
            {getNavbarItems(inApprovalCount)
              .filter(
                (data) =>
                  validatePaths()[currentUser?.role ?? 'user:viewer']?.includes(
                    data.path
                  ) || data.path === '/'
              )
              .map((item, index) => (
                <NavbarItem item={item} key={index} />
              ))}
            <FooterContainer>
              <Column gap="xxxs">
                <Divider />
                {currentUser?.role === UserRole.SuperAdmin && (
                  <Text
                    variant="body_sm_regular"
                    color={theme.textColor.layout.secondary.value}
                  >
                    CDAX
                  </Text>
                )}
              </Column>
              {currentUser?.role === UserRole.SuperAdmin && (
                <NavbarItem
                  item={{
                    icon: 'shield-user',
                    label: 'Super Admin Users',
                    path: '/admin-users',
                  }}
                />
              )}
              <NavbarItem
                item={{ icon: 'logout-2', label: 'Log Out', path: '/?' }}
              />
              {currentUser?.role !== UserRole.SuperAdmin && (
                <NavbarItem
                  item={{
                    icon: 'exclamation-square',
                    label: 'About',
                    path: '/about',
                  }}
                />
              )}
              <UserAvatar sidebarOpen={isOpen} />
              <ExpandButtonContainer>
                <ExpandButton onClick={() => toggleSidebar()}>
                  {isOpen ? (
                    <Icon variant="alt-arrow-left" size="sm" />
                  ) : (
                    <Icon variant="alt-arrow-right" size="sm" />
                  )}
                </ExpandButton>
              </ExpandButtonContainer>
            </FooterContainer>
          </ContentContainer>
        </MainContainer>
      </div>
    </Suspense>
  );
};

export default Navbar;
