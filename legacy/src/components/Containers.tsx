import styled from "styled-components";
import { device } from "../utils/media-query-helpers";

export const BasicFormContainer = styled.div`
    @media(max-width: 768px){
        width: 90vw;
        min-width: 90vw;
        background-color:${(props) => props.theme.colors.primary};
        padding: 0px;
        padding-bottom: 10px;
    }
    @media(min-width: 992px){
        width: 40vw;
    }
    width: 50vw;
    min-width: 780px;
    border-radius: 15px;
    text-align: center;
    color: ${(props) => props.theme.colors.fg};
    background-color: ${(props) => props.theme.colors.bg};
    padding:10px 30px;
    z-index:1;
`;
export const Container =styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    z-index:1;
`
export const NextButton = styled.div`
    @media(max-width: 768px){
        background-color: ${props=>props.theme.colors.primary};
        margin-top: 0;
    }
    display: flex;
    justify-content: center;
    cursor:pointer;
    flex-direction: row;
    margin-top: 20px;
    padding:0  20px 20px 20px;
`
export const NextButtonWhite = styled.div`
    @media(max-width: 768px){
        // background-color: ${props=>props.theme.colors.bg};
        margin-top: 0;
    }
    display: flex;
    justify-content: center;
    cursor:pointer;
    flex-direction: row;
    margin-top: 20px;
    padding:0  20px 20px 20px;
`
export const CircleRegion = styled.div`
    @media (max-width: 768px) {
        display: flex;
        transform: translate(50px, 70px);
        justify-content: flex-start;
    }
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.colors.bgrey};
`;
export const IndividualButton = styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: start;
    border-radius: 100%;
    align-items: center;
`;
export const LeftButton =styled.div`
    @media ${device.sm} {
        flex-direction: row;
        justify-content: flex-start;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 100%;
    padding: 10px 0;
`;
export const BottomRoundContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1;
    margin-top: -1px;
    background: ${(props) => props.theme.colors.primary}
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
`;
export const BtnRowContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    // margin: 10px 10px -20px 0px;
    align-items: center;
    @media (max-width: 768px) {
        display: block;
        margin: auto;
    }
`;
