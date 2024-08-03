import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

type SpinnerSize = 'large' | 'small';

interface SpinnerProps {
    size?: SpinnerSize;
    color?: string;
}

export const Spinner = styled.div<SpinnerProps>`
margin: 60px auto;
font-size: 10px;
position: relative;
text-indent: -9999em;
border-top: ${props => props.size === 'large' ? '1.1em' : '0.3em'} solid rgba(255, 255, 255, 0.2);
border-right: ${props => props.size === 'large' ? '1.1em' : '0.3em'} solid rgba(255, 255, 255, 0.2);
border-bottom: ${props => props.size === 'large' ? '1.1em' : '0.3em'} solid rgba(255, 255, 255, 0.2);
border-left: ${props => props.size === 'large' ? '1.1em' : '0.3em'} solid ${props => props.color || props.theme.colors.primary};
-webkit-transform: translateZ(0);
-ms-transform: translateZ(0);
transform: translateZ(0);
-webkit-animation: loading-spinner 1.1s infinite linear;
animation: loading-spinner 1.1s infinite linear;
border-radius: 50%;
width: ${props => props.size === 'large' ? '10em' : '2em'} ;
height: ${props => props.size === 'large' ? '10em' : '2em'} ;

&:after {
    border-radius: 50%;
    width: ${props => props.size === 'large' ? '10em' : '2em'} ;
    height: ${props => props.size === 'large' ? '10em' : '2em'} ;
}

@keyframes loading-spinner {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
`;

export const Progress = styled(FontAwesomeIcon)`
color: ${(props) => props.theme.colors.primary};
font-size: 2em;
padding: 10px 20px;
animation: spin infinite 1.5s linear;
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
