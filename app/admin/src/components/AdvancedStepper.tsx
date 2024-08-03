import { Stepper } from "react-form-stepper";
import styled from "styled-components";

export const AdvancdStepper = styled(Stepper)`
    @media(max-width: 768px){
        width: 90vw;
    }
    @media(min-width: 992px){
        width: 50vw;
    }
    width: 60vw;
`
export const InsideStepper = styled(Stepper)`
    @media(max-width: 768px){
        width: 90vw;
    }
    @media(min-width: 992px){
        width: 50vw;
    }
    width: 100%;
`