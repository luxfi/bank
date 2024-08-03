import styled from 'styled-components';
import { device } from '../utils/media-query-helpers';
interface Props {
    size?: 'small' | 'large' | 'long';
    primary?: boolean;
    disabled?: boolean;
    secondary?: boolean;
    danger?: boolean;
    margin?: string;
    bgrey?: boolean;
    sky?: boolean;
}

function getButtonColor(props: any) {
    if (props.primary) {
        return props.theme.colors.primary;
    }

    if (props.secondary) {
        return props.theme.colors.secondary;
    }

    if (props.disabled) {
        return props.theme.colors.disabled;
    }

    if (props.danger) {
        return props.theme.colors.danger;
    }
    if(props.bgrey){
        return props.theme.colors.bgrey;
    }
    if(props.sky){
        return props.theme.colors.sky;
    }
    return props.theme.colors.fg;
}

const Button = styled.button<Props>`
    @media(max-width: 768px){
        width: 100%;
        /* margin: auto; */
    }
    @media(min-width: 992px){
        /* padding: 10px; */
        margin: auto;
        
    } 
    cursor: pointer;
    border: ${(props) => props.size === 'small' ? '2px' : '3px'} solid ${getButtonColor};
    border-radius: 15px;
    padding: ${(props) => {
        if(props.size === 'long')
            return '5px 25px'
        return props.size === 'small' ? '5px 15px' : '10px 25px'
    }};
    margin: ${(props) => props.margin ? props.margin : '5px'};
    min-width: ${(props) => props.size === 'long' ? '150px' : 'auto' };
    display: inline-block;
    color: ${props => props.bgrey? props.theme.colors.black: props.theme.colors.bg};
    background: ${getButtonColor};
    text-align: center;
    font-size: ${(props) => props.size === 'small' ? '0.8em' : '1.2em'};
    transition: background-color 200ms, box-shadow 200ms;

    &:hover, &:active {
        background: ${props =>props.bgrey? props.theme.colors.primary: props.theme.colors.bgrey};
        color: ${props =>props.bgrey? props.theme.colors.bg: props.theme.colors.black};
    }
    &:disabled {
        background: gray;
        color: white;
        border-color: gray;
    }
`;
export const EditButton = styled.button<Props>`
    cursor: pointer;
    border: 2px solid ${getButtonColor};
    border-radius: 4px;
    padding: 2px 15px;
    margin: ${(props) => props.margin ? props.margin : '5px'};
    min-width: 60px;
    display: inline-block;
    color: ${props => props.theme.colors.bg};
    background: ${getButtonColor};
    text-align: center;
    font-size: 0.8em;
    transition: background-color 200ms, box-shadow 200ms;

    &:hover, &:active {
        background: ${props => props.theme.colors.bg};
        color: ${getButtonColor};
    }
`;

export default Button;
