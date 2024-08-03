import { useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Layout from "../../components/Layout";
import { logout, selectCurrentUser } from "../../features/auth/AuthSlice";

const Container = styled.div`
    margin: 70px auto;
    text-align: center;
    @media(max-width: 768px){
        width: 90vw;
        // background-color:${(props) => props.theme.colors.primary};    
    }
    @media(min-width: 992px){
        width: 40vw;
    }
    width: 50vw;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding:10px 30px;
    z-index:1;
`;
export default function ThankYou() {
    return <Layout>
        <Container>
            <h2>Thank you</h2>
            <p>
                Please check your email and follow any necessary instructions. <br />
                A consultant will be in contact with you shortly.
            </p>
        </Container>
    </Layout >;
}
