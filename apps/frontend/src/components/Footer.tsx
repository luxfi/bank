import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Constants from '../Constants';
import { device } from '../utils/media-query-helpers';

const Container = styled.footer`
    background-color: ${props => props.theme.colors.bg};
    padding: 5px 0 7px 0;
    display: flex;
    flex-direction: row-reverse;
    padding: 10px 0;
    color: ${props => props.theme.colors.label};
    font-size: 12px;
    position: relative;
    left: 0;
    bottom: 0;
    width: 100%;
`;

const InnerContainer = styled.div`
    display: flex;
    justify-content: space-around; 
    flex-wrap: wrap; 
    flex-direction: row;
    width: 100%;
    padding: 14px 50px;
`;

const Column = styled.div`
    @media ${device.lg} {
        flex: 30%;
    }

    flex: 100%;
`;

const LeftColumn = styled(Column)`
    @media ${device.lg} {
        text-align: left;
        flex-direction: row;
        align-items: flex-start;
    }
    
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin: 15px;
`;

const LeftColumnText = styled.span`
    @media ${device.lg} {
        margin-left: 15px;
    }
`;

const CenterColumn = styled(Column)`
    text-align: center;
    margin: 15px;
`;

const RightColumn = styled(Column)`
    @media ${device.lg} {
        text-align: right;
        align-items: flex-start;
    }

    text-align: center;
    align-items: center;
    margin: 15px;
`;
const MaxRightColumn = styled(Column)`
    @media ${device.lg} {
        display: none;
    }
    text-align: center;
    align-items: center;
    margin: 15px;
`;

const FooterLink = styled.a`
    color: ${props => props.theme.colors.label};
    text-decoration: none;
`;

export default function Footer() {
    const navigate = useNavigate();
    return (
        <Container>
            <InnerContainer>
                <LeftColumn>
                    <a href={Constants.HOMEPAGE_URL} onClick={() => {
                        navigate('/');
                        return false;
                    }}>
                        <img src={`${process.env.PUBLIC_URL}/images/footer-logo.svg`} width="50" alt="CDAX Forex" />
                    </a>
                    <LeftColumnText>
                        CDAX Forex <br />
                        135485C<br/>
                        27 Hope Street, Douglas, IM1 1AR, Isle of Man <br />
                        CDAX Forex - © Copyright {new Date().getFullYear()}
                    </LeftColumnText>
                </LeftColumn>
                <CenterColumn>
                    Licensed by the Isle of Man Financial Services Authority.<br /><br />
                    CDAX Forex is a registered trading name of CDAX Limited.<br />
                    Registered office: 27 Hope Street, Douglas, Isle of Man, IM1 1AR<br/>
                    Company number: 135485C
                    <br/><br/>
                    The money transmission services we provide do not constitute deposit taking activity and are not protected by a compensation scheme
                </CenterColumn>
                <RightColumn>
                    <FooterLink href={Constants.PRIVACY_POLICY_URL} onClick={() => {
                        navigate(Constants.PRIVACY_POLICY_URL);
                        return false;
                    }}>Privacy Policy</FooterLink>
                    <span> | </span>
                    <FooterLink href={Constants.TERMS_OF_SERVICE_URL}  onClick={() => {
                        navigate(Constants.TERMS_OF_SERVICE_URL);
                        return false;
                    }}>Terms & Conditions</FooterLink>
                </RightColumn>
                <MaxRightColumn>
                    Regulated by the IOM Financial Services Authority
                </MaxRightColumn>
            </InnerContainer>
        </Container>
    );
}
