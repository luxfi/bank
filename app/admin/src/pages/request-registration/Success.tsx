import Lottie from "lottie-react";
import styled from "styled-components";
import checkAnimation from "../../Animations/check.json";
import Layout from "../../components/Layout";

export default function RequestRegistrationSucess() {
    return (
        <Layout>
            <Container>
                <AnimationContainer>
                    <Lottie
                        animationData={checkAnimation}
                        loop={false}
                        autoplay={true}
                        rendererSettings={{
                            preserveAspectRatio: "xMidYMid slice",
                        }}
                        style={{
                            width: "125px",
                            height: "125px",
                            marginBottom: "1rem",
                        }}
                    />
                    <span>Your request has been sent.</span>
                    <span>
                        As soon as we analyze your data, we will contact you by
                        email or phone
                    </span>
                </AnimationContainer>
            </Container>
        </Layout>
    );
}

const Container = styled.div`
    display: flex;
    flex: 1;
    height: 80vh;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("/images/blue_background.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media (max-width: 768px) {
        overflow-y: hidden;
    }
`;

const AnimationContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span {
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 500;
        margin: 0.5em 0;
        margin: 5px;
        color: ${(props) => props.theme.colors.bg};
    }

    span:last-child {
        font-size: 16px;
        text-align: center;
    }
`;
