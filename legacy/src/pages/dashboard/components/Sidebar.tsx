import {
    IconDefinition,
    faAddressBook,
    faBars,
    faClockRotateLeft,
    faDoorClosed,
    faFolder,
    faHandHoldingDollar,
    faHouse,
    faMessage,
    faRefresh,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    PropsWithoutRef,
    MouseEvent as ReactMouseEvent,
    useState,
} from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import Constants from "../../../Constants";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { logout, selectCurrentUser } from "../../../features/auth/AuthSlice";
import {
    UserAdminRoles,
    UserOrAdminRoles,
    UserPaymentRoles,
} from "../../../features/auth/user-role.enum";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import { device } from "../../../utils/media-query-helpers";

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);

    return (
        <Container>
            <List isExpanded={isExpanded}>
                <SidebarLink
                    text="Menu"
                    icon={faBars}
                    onClick={() => setIsExpanded(!isExpanded)}
                />
                <UserRoleChecker roles={UserOrAdminRoles}>
                    <SidebarLink
                        text="Dashboard"
                        icon={faHouse}
                        to="/dashboard"
                    />
                    <SidebarLink
                        text="Beneficiaries"
                        icon={faAddressBook}
                        to="/dashboard/beneficiaries"
                    />
                    <UserRoleChecker roles={UserPaymentRoles}>
                        <SidebarLink
                            text="Create a payment"
                            icon={faHandHoldingDollar}
                            to="/dashboard/payments/wizard/GBP"
                        />
                        <SidebarLink
                            text="Convert"
                            icon={faRefresh}
                            to="/dashboard/currencies/GBP"
                        />
                        <SidebarLink
                            text="Pending"
                            icon={faClockRotateLeft}
                            to="/dashboard/pending"
                        />
                    </UserRoleChecker>
                    <SidebarLink
                        text="Search"
                        icon={faSearch}
                        to="/dashboard/search"
                    />
                </UserRoleChecker>
                <SidebarLink
                    text="Users"
                    icon={faAddressBook}
                    to="/dashboard/users"
                />

                <UserRoleChecker roles={UserAdminRoles} ignore>
                    <SidebarLink
                        text="Invite a user"
                        icon={faAddressBook}
                        to="/dashboard/users/invite"
                    />
                </UserRoleChecker>

                {/* <SidebarLink
                    text="Help Centre"
                    icon={faMessage}
                    onClick={() => window.open(Constants.HELP_CENTRE_URL)}
                /> */}
                {/* <SidebarLink text='Support' icon={faLifeRing} to='/' /> */}
                <UserRoleChecker roles={UserOrAdminRoles} reverse>
                    <SidebarLink
                        text="Submit documents"
                        icon={faFolder}
                        to="/dashboard/documents"
                    />
                </UserRoleChecker>
                <SidebarLink
                    text="Log out"
                    icon={faDoorClosed}
                    onClick={() => dispatch(logout())}
                />
            </List>
        </Container>
    );
}

interface SidebarLinkProps {
    to?: string;
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    text: string;
    icon: IconDefinition;
}

function SidebarLink({
    to = "/dashboard",
    onClick,
    text,
    icon,
}: PropsWithoutRef<SidebarLinkProps>) {
    return (
        <ListItem>
            {onClick ? (
                <StyledAnchor onClick={onClick}>
                    <Icon icon={icon} />
                    {text}
                </StyledAnchor>
            ) : (
                <StyledLink to={to}>
                    <Icon icon={icon} />
                    {text}
                </StyledLink>
            )}
        </ListItem>
    );
}

const Icon = styled(FontAwesomeIcon)`
    font-weight: normal;
    margin-right: 10px;
    font-size: 18px;
`;

const linkStyle = css`
    color: ${(props) => props.theme.colors.primary};
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 15px 30px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms ease-in;

    &:hover,
    &:active,
    &.active {
        color: ${(props) => props.theme.colors.secondary};
    }
`;

const StyledLink = styled(Link)`
    ${linkStyle}
`;
const StyledAnchor = styled.a`
    ${linkStyle}
`;

const Container = styled.nav`
    @media ${device.xs} {
        background-color: ${(props) => props.theme.colors.bg};
        color: ${(props) => props.theme.colors.bg};
        height: 100%;
        width: 100%;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        border-bottom-left-radius: 0px;
        padding: 1rem 0;
    }
    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.bg};
    height: 100%;
    width: 100%;
    padding: 1rem 0;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    border-top-right-radius: 0px;
`;

const List = styled.ul<{ isExpanded: boolean }>`
    // @media ${device.lg} {
    //     position: fixed;
    // }
    margin: 0px;
    padding: 0px;
    list-style: none;
    width: 220px !important;
    padding: 10px 0px;

    & li:first-child {
        display: block;
    }

    & > li {
        display: ${(props) => (props.isExpanded ? "block" : "none")};
    }

    @media ${device.sm} {
        & > li {
            display: block;
        }

        & li:first-child {
            display: none;
        }
    }
`;

const ListItem = styled.li`
    margin: 0px;
    padding: 0px;
    list-style: none;
    width: fit-content;
`;
