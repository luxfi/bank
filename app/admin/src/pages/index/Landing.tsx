import { Navigate, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import ListItem from "../../components/ListItem";
import Button from "../../components/Button";
export default function Landing() {
    const navigate = useNavigate();
    return (
        <Container>
            <MainContainer>
                <TextContainer>
                    <Title>Opening up an account is light work. Create yours in minutes!</Title>
                    <ul>
                        <ListItem text="If you are opening an account as a business, tell us about your business"/>
                        <ListItem text="You’ll need to share details like your business registration, where you’re located etc."/>
                        <ListItem text="Tell us about yourself and your expected activity and volume of trades with CDAX Forex"/>
                        <ListItem text="Add your bank account details " />
                        <ListItem text="If we ask to verify you, once we receive your documents, we’ll work to get it done within 2–3 working days" />
                        <ListItem text="That’s it you’re verified "/>
                    </ul>
                    <NextButton>
                        <Button secondary style = {{width: '50%', margin:'50px 0px'}} onClick={() => navigate('/registration')}>Request registration</Button>
                    </NextButton>
                </TextContainer>
            </MainContainer>
            <SubContainer>
                <ImageContainer>
                    <img id="img1" src={`${process.env.PUBLIC_URL}/images/xsphone.png`} alt="Mini Phone"  style={{transform:'translate(0, 15%) scale(0.9)', width: '100%', height: '100%'}}/>
                    <img src={`${process.env.PUBLIC_URL}/images/lgphone.png`} alt="Mini Phone"  style={{transform:'translate(-30%,10%)', width: '100%', height: '100%'}}/>
                </ImageContainer>
            </SubContainer>
        </Container>
    )
};

const NextButton =styled.div`
    @media(max-width: 768px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    @media(max-width: 992px) {
        flex-direction: row;
        justify-content: center;
        margin: 0;
    }
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 100%;
`;

const Container = styled.section`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-direction: row;
    padding: 20px 50px;
    max-width: 1900px;   
    
    @media(max-width: 992px){
        flex-direction: column;
        justify-content: center;
        align-items: center;

    } 
`;
const MainContainer = styled.section`
    flex-grow:7;
    flex-basis:100px;
`
const SubContainer = styled.section`
    flex-grow:5;
    flex-basis:100px;
`
const TextContainer = styled.section`
    @media(max-width: 768px){
        padding: 30px 0;
    }   
    flex-direction: column;
    padding: 30px 50px 0 0;
`
const ImageContainer = styled.section`
    display: flex;
    flex-direction: row;
    justify-content:center;

    @media(min-width: 1200px){
        width: 75%;
        margin: auto;
    } 

    @media(max-width: 992px){
        width: 50%;
        margin: auto;
        margin-top: 30px;
        z-index: 1;
        transform: translate(0px, -80px);
    } 
    @media(min-width: 1600px){
        width: 75%;
        margin: auto;
    } 
`
const Title = styled.h1`
    color: ${(props) => props.theme.colors.bg};
    font-size: 56px;
    padding:50px 0;
    @media(max-width: 768px){
        font-size: 40px;
    }   
`

