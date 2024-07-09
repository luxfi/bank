import styled from "styled-components";
import Button from "../../../components/Button";
import { device } from "../../../utils/media-query-helpers";

export const SlideButton = styled(Button)`
@media(max-width:768px){
    flex: none;
    margin: 30px 20px;
}
    width: 100%;
    border-radius: 30px;
`;
