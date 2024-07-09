import styled from "styled-components";
import BaseSlide from "./BaseSlide";
import { device } from "../../../utils/media-query-helpers";
import { SlideProps } from "../helpers/slide-types";
export default function DocumentsEnd(props: SlideProps) {
    return (
    <>
        <BaseSlide key='documents-upload-slide' title="empty" sort="empty">
            <Container>
                <FullButton>
                    <FullCircleRegion>
                        <img src={`${process.env.PUBLIC_URL}/images/check.svg`} width="45px" height="45px" alt="Done!" />   
                    </FullCircleRegion>
                </FullButton>
                <IndividualButton>
                    <LargeLabel>
                        That’s it, all done!
                    </LargeLabel>
                </IndividualButton>
                <IndividualButton>
                    <Label>
                        Please check your email and follow any necessary instructions. A consultant will be in contact with you shortly.
                    </Label>
                </IndividualButton>
            </Container>
        </BaseSlide>
    </>
    // </RequireAuth>
    )
}
const Container = styled.div`
    @media(max-width:768px){
        display: flex;
        flex-direction: column;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color: ${props=>props.theme.colors.bg};
        padding:0 30px 20px 30px;
    }
    
`
const IndividualButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: center;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 100%;
    align-items:center;
`;


const FullButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: center;
    }
    display: flex;
    flex-direction: row;
    justify-content: center;
    border-radius: 100%;
    align-items:center;
    margin-top: 30px;
`;
const FullCircleRegion = styled.div`
    display: flex;
    justify-content: center;
    width: 136px;
    height: 136px;
    border-radius: 100%;
    align-items: center;
    background-color: ${props=>props.theme.colors.secondary};
`;


const LargeLabel = styled.h2`
    color: ${(props) => props.theme.colors.label};
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    opacity: 0.9;
    justify-content: center;
    text-align: center;
`;
const Label = styled.label`
    color: ${(props) => props.theme.colors.label};
    display: flex;
    flex-direction: row;
    padding: 3px 10px;
    font-size: 0.8em;
    opacity: 0.5;
    justify-content: center;
    text-align: center;
    margin-bottom: 30px;
`;
