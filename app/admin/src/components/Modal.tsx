import { Modal as M} from "antd";
import styled from "styled-components";
export const Modal = styled(M)`
    .ant-modal-header {
        background-color: #00569E;
    }
    .ant-modal-title, .ant-modal-close {
        color: white;
    }
    .ant-modal-close:hover {
        color: gray;
    }
    
`;
export const {confirm} = M;