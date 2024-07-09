import { faAddressBook, faArchive, faBars, faBoxArchive, faDeleteLeft, faDoorClosed, faFolder, faHouse, faLifeRing, faMessage, faRemove, faSearch, faUserLock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent as ReactMouseEvent, PropsWithoutRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../../features/auth/AuthSlice";
import { device } from "../../../utils/media-query-helpers";

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useAppDispatch();

    return <Container>
        <List isExpanded={isExpanded}>
            <SidebarLink text='Menu' icon={faBars} onClick={() => setIsExpanded(!isExpanded)} />
            <SidebarLink text='Dashboard' icon={faHouse} to='/admin' />
            <SidebarLink text='Clients' icon={faAddressBook} to='/admin/clients' />
            <SidebarLink text='Beneficiaries' icon={faAddressBook} to='/admin/beneficiaries' />
            <SidebarLink text='Users' icon={faAddressBook} to='/admin/users' />
            <SidebarLink text='Documents' icon={faFolder} onClick={() => window.open('https://cdaxkycuploads.cdaxforex.com/index.php/')} />
            <SidebarLink text="Search" icon={faSearch} to="/admin/search" />
            {/* <SidebarLink text='Support tickets' icon={faLifeRing} onClick={() => window.open('https://cdaxforex.paydirect.io/login')} /> */}
            {/* <SidebarLink text='Notifications' icon={faMessage} to='/admin/dashboard' /> */}
            <SidebarLink text='Admin Users' icon={faMessage} to='/admin/admins' />
            <SidebarLink text='Archived Users' icon={faUserLock} to='/admin/archived-users' />
            {/* <SidebarLink text='Archive' icon={faMessage} to='/admin/dashboard' /> */}
            <SidebarLink text='Log out' icon={faDoorClosed} onClick={() => dispatch(logout())} />
        </List>
    </Container>;
};

interface SidebarLinkProps {
    to?: string;
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    text: string;
    icon: IconDefinition;
}

function SidebarLink({ to = '/dashboard', onClick, text, icon }: PropsWithoutRef<SidebarLinkProps>) {
    return (
        <ListItem>
            {onClick
                ? <StyledAnchor onClick={onClick}>
                    <Icon icon={icon} />
                    {text}
                </StyledAnchor>
                : <StyledLink to={to}>
                    <Icon icon={icon} />
                    {text}
                </StyledLink>
            }
        </ListItem>
    );
}


const Icon = styled(FontAwesomeIcon)`
font-weight: normal;
margin-right: 10px;
font-size: 18px;
`;

const linkStyle = css`
color: ${props => props.theme.colors.primary};
display: block;
width: 100%;
box-sizing: border-box;
padding: 15px 30px;
font-size: 14px;
font-weight: 600;
cursor: pointer;
transition: all 200ms ease-in;

&:hover, &:active, &.active {
    color: ${props => props.theme.colors.secondary};
}
`;

const StyledLink = styled(Link)`${linkStyle}`;
const StyledAnchor = styled.a`${linkStyle}`;

const Container = styled.nav`
background-color: ${props => props.theme.colors.bg};
color: ${props => props.theme.colors.bg};
height: 100%;
width: 100%;

border-radius: 10px 0px 0px 10px;
`;

const List = styled.ul<{ isExpanded: boolean }>`
margin: 0px;
padding: 0px;
list-style: none;
width: 100%;
padding: 10px 0px;

& li:first-child {
    display: block;
}

&>li {
    display: ${props => props.isExpanded ? 'block' : 'none'};
}

@media ${device.sm} {
    &>li {
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
width: 100%;
`;
