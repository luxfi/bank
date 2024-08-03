import { UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Constants from "../Constants";
import { useAppSelector } from "../app/hooks";
import { selectCurrentUser } from "../features/auth/AuthSlice";
import { device } from "../utils/media-query-helpers";
import Button from "./Button";
import ClientSelector from "./ClientSelector";
import { AdminRoles } from "../features/auth/user-role.enum";

const Container = styled.header`
    @media ${device.xs} {
        // flex-direction: row;
        // justify-content: space-between;
        // top: 0;
        // position: sticky;
        // background: white;
        // z-index: 100;
        // background-color: ${(props) => props.theme.colors.white};
        padding: 14px 20px;
        // align-items: center;
    }
    background-color: ${(props) => props.theme.colors.white};
    padding: 14px 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    position: sticky;
    background: white;
    z-index: 100;
    // @media(max-width: 768px){
    //     justify-content: center;
    // }
`;

const ButtonsContainer = styled.section`
    @media ${device.sm} {
        margin: 0px;
    }
    margin: 30px auto;
    overflow: hidden;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    @media (max-width: 768px) {
        display: inherit;
        position: absolute;
        top: 0;
        right: 20px;
    }
`;

const Logo = styled.div`
    background-image: url("${process.env.PUBLIC_URL}/images/logo-earth.svg");
    background-repeat: no-repeat;
    width: 40px;
    height: 30px;
    margin: 0px 5px;
`;

interface IProps {
    currentLocation?: string;
}

export default function Header({ currentLocation }: IProps) {
    const navigate = useNavigate();
    const ProfileBtn = () => (
        <Avatar
            style={{ backgroundColor: "#00569f" }}
            icon={<UserOutlined />}
        />
    );
    const currentUser = useAppSelector(selectCurrentUser);

    const hiddenButtonsRoutes = [
        "/",
        "/login",
        "/2fa",
        "/registration",
        "/registration/success",
    ];

    return (
        <Container>
            <Link to="/">
                <img
                    src={`${process.env.PUBLIC_URL}/images/cdax-logo.svg`}
                    style={{ width: "200px" }}
                    alt="CDAX Forex"
                />
            </Link>
            <ButtonsContainer>
                {currentLocation === "/" && (
                    <Button
                        primary
                        type="button"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Login
                    </Button>
                )}
                {!hiddenButtonsRoutes.includes(currentLocation || "") && (
                    <>
                        {currentUser && !AdminRoles.includes(currentUser.role) && (
                            <ClientSelector />
                        )}

                        {/* <a
                            href={Constants.HOMEPAGE_URL}
                            target="_blank"
                            rel="noopener"
                            style={{
                                marginTop: "2px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Logo />
                        </a> */}
                        <Tooltip
                            placement="bottom"
                            title={
                                currentUser?.username ? "My Profile" : "Log in"
                            }
                        >
                            <Link
                                to={
                                    currentUser?.username
                                        ? "/dashboard/profile"
                                        : "login"
                                }
                                style={{
                                    marginTop: "2px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <ProfileBtn />
                            </Link>
                        </Tooltip>
                    </>
                )}
            </ButtonsContainer>
        </Container>
    );
}
