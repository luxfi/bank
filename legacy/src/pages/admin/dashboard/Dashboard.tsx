import { MouseEvent as ReactMouseEvent, PropsWithoutRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import RequireAuth from "../../../features/auth/RequireAuth";
import { AdminRoles } from "../../../features/auth/user-role.enum";
import { device } from "../../../utils/media-query-helpers";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import Button from "../../../components/Button";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../../features/auth/AuthSlice";
export default function Dashboard() {
    const dispatch = useAppDispatch();
    const navigationButtons = (
        <Button secondary size = 'long' margin = '10px' onClick={() => dispatch(logout())} style = {{width: 'auto'}}>
            Log out
        </Button>
    )
    return (
        <RequireAuth roles={AdminRoles}>
            <AdminDashboardLayout navigationButtons = {navigationButtons}>
                <Container>
                    <LinksContainer>
                        <DashboardLink
                            icon='add-beneficiary'
                            text='View Clients'
                            to='/admin/clients'
                        />

                        <DashboardLink
                            icon='add-beneficiary'
                            text='New Client'
                            to='/admin/clients/new'
                        />

                        {/* <DashboardLink
                            icon='add-beneficiary'
                            text='Notifications'
                            onClick={() => window.open('https://cdaxforex.paydirect.io/login')}
                        /> */}
                    </LinksContainer>
                </Container>
            </AdminDashboardLayout>
        </RequireAuth>
    );
}

const Container = styled.section`
@media ${device.sm} {
    justify-content: flex-start;
}

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100%;
`;

const LinksContainer = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    @media ${device.sm} {
        flex-direction: row;
        align-items: flex-start;
    }
`;

interface DashboardLinkProps {
    to?: string;
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    text: string;
    description?: string;
    icon: string;
}

function DashboardLink({ to = '/', onClick, text, description, icon }: PropsWithoutRef<DashboardLinkProps>) {
    const content = <LinkContent>
        <LinkText>{text}</LinkText>
        <LinkIcon
            src={`${process.env.PUBLIC_URL}/images/dashboard/${icon || 'human'}.svg`}
            alt={text}
        />
        <LinkDescription>{description}</LinkDescription>
    </LinkContent>
    return (
        <>
            {onClick
                ? <StyledAnchor icon={icon} onClick={onClick}>
                    {content}
                </StyledAnchor>
                : <StyledLink icon={icon} to={to}>
                    {content}
                </StyledLink>
            }
        </>
    );
}

type HasIcon = { icon: string };

const linkStyle = css<HasIcon>`
cursor: pointer;
display: flex;
box-sizing: border-box;
width: 200px;
align-items: flex-end;
justify-content: center;
padding-bottom: 10px;
font-weight: 900;
margin: 5px;
transition: all 100ms ease;
color: ${props => props.theme.colors.fg};

&:hover {
    color: ${props => props.theme.colors.fg};
}
`;

const LinkContent = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const LinkText = styled.span`
font-size: 1em;
`;

const LinkDescription = styled.p`
font-size: 0.8em;
text-align: center;
font-weight: normal;
`;

const LinkIcon = styled.img`
margin: 10px;
width: 64px;
height: 64px;
`;

const StyledLink = styled(Link) <HasIcon>`${linkStyle}`;
const StyledAnchor = styled.a<HasIcon>`${linkStyle}`;


