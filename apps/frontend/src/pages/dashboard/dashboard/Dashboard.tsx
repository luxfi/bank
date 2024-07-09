import {
    MouseEvent as ReactMouseEvent,
    PropsWithoutRef,
    useEffect,
} from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import RequireAuth from "../../../features/auth/RequireAuth";
import {
    UserPaymentRoles,
    UserRoles,
} from "../../../features/auth/user-role.enum";
import { device } from "../../../utils/media-query-helpers";
import UserRoleChecker from "../../../utils/UserRoleChecker";
import DashboardLayout from "../components/DashboardLayout";
import ToDoWidget from "./ToDoWidget";
import {
    loadToDoList,
    selectTodoList,
} from "../../../features/dashboard/DashboardSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
    loadUserDocuments,
    selectUserDocuments,
} from "../../../features/documents/DocumentsSlice";
import { selectCurrentUser } from "../../../features/auth/AuthSlice";
import { EntityType } from "../../../features/registration/RegistrationSlice";
import { individualDocuments } from "../../../features/documents/model/individualDocuments";
import { businessDocuments } from "../../../features/documents/model/businessDocuments";
import { snakeToWords } from "../../../utils/functions";
const DocuemntText = styled(Link)`
    color: ${(props) => props.theme.colors.primary};
`;
export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const toDoList = useAppSelector(selectTodoList);
    useEffect(() => {
        dispatch(loadToDoList());
    }, [dispatch]);
    // console.log(toDoList);
    useEffect(() => {
        dispatch(loadUserDocuments());
    }, [dispatch]);
    const documents = useAppSelector(selectUserDocuments);
    const documentTypes = documents.map((document) => document.type);
    const user = useAppSelector(selectCurrentUser);
    let message = "";
    if (user) {
        const requiredDocuments =
            user.accountType === EntityType.Individual
                ? individualDocuments
                : businessDocuments;
        let missing = [];
        for (const requiredDocument of requiredDocuments) {
            if (!documentTypes.includes(requiredDocument.type))
                missing.push(snakeToWords(requiredDocument.type));
        }
        if (missing.length) {
            message = missing.join(", ");
        }
    }
    return (
        <RequireAuth roles={UserRoles}>
            <DashboardLayout>
                <Container>
                    <p style={{ textAlign: "center", fontWeight: "700" }}>
                        {message && !user?.isApproved ? (
                            <>
                                You must submit the following documents before
                                using CDAX:
                                <br />{" "}
                                <DocuemntText to="/dashboard/documents">
                                    {message}
                                </DocuemntText>
                            </>
                        ) : user?.isApproved ? (
                            ""
                        ) : (
                            "Your documents are being reviewed, you'll be updated soon."
                        )}
                    </p>
                    <LinksContainer>
                        <DashboardLink
                            icon="view-accounts"
                            text="View accounts"
                            description="Manage and fund your multi-currency wallet"
                            to="/dashboard/balances"
                        />
                        <UserRoleChecker roles={UserPaymentRoles}>
                            <DashboardLink
                                icon="add-beneficiary"
                                text="Add a beneficiary"
                                description="Set-up new beneficiary to pay"
                                to="/dashboard/beneficiaries/new"
                            />

                            <DashboardLink
                                icon="new-payment"
                                text="Create a payment"
                                description="Make a new payment"
                                to="/dashboard/payments/wizard/GBP"
                            />
                            <DashboardLink
                                icon="make-conversion"
                                text="Make a conversion"
                                description="Book a currency conversion"
                                to="/dashboard/currencies/GBP"
                            />
                        </UserRoleChecker>
                    </LinksContainer>
                    {user?.isApproved && <ToDoWidget {...toDoList} />}
                </Container>
            </DashboardLayout>
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
    /* height: 100%; */
    min-height: 80vh;
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
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    text: string;
    description: string;
    icon: string;
}

function DashboardLink({
    to = "/",
    onClick,
    text,
    description,
    icon,
}: PropsWithoutRef<DashboardLinkProps>) {
    const content = (
        <LinkContent>
            <LinkText>{text}</LinkText>
            <LinkIcon
                src={`${process.env.PUBLIC_URL}/images/dashboard/${
                    icon || "human"
                }.svg`}
                alt={text}
            />
            <LinkDescription>{description}</LinkDescription>
        </LinkContent>
    );
    return (
        <>
            {onClick ? (
                <StyledAnchor icon={icon} onClick={onClick}>
                    {content}
                </StyledAnchor>
            ) : (
                <StyledLink icon={icon} to={to}>
                    {content}
                </StyledLink>
            )}
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
    color: ${(props) => props.theme.colors.fg};

    &:hover {
        color: ${(props) => props.theme.colors.fg};
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

const StyledLink = styled(Link)<HasIcon>`
    ${linkStyle}
`;
const StyledAnchor = styled.a<HasIcon>`
    ${linkStyle}
`;
