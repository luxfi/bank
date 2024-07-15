import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Container = styled.section`
    background: url(${process.env.PUBLIC_URL}/images/bk-image.png), url(${process.env.PUBLIC_URL}/images/bk-image.png);
    background-position: left top, right top;
    background-size: 6%;
    background-repeat: repeat-y !important;
    min-height: 80vh;
`;

const InnerContainer = styled.section`
    box-sizing: border-box;
    /* max-width: 1300px; */
    background-color: ${(props) => props.theme.colors.primary};
    margin: 0 auto;
    
`;

export default function Body({ children }: PropsWithChildren<{}>) {
    return (
        <Container>
            <InnerContainer>
                {children}
            </InnerContainer>
        </Container>
    );
}
