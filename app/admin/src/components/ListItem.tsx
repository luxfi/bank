import styled from "styled-components";
interface Props {
    color?:string
}

export default function ListItem({text}: {text: string}) {
    return <Item >
        {text}
    </Item>
};

const Item = styled.li<Props>`
color:  ${(props) =>props.theme.colors.bg};
font-size:18px;
margin:25px auto;
`
