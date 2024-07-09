import { Steps } from "antd";
import styled from "styled-components";
import { AppTheme } from "../AppTheme";

interface IStepperProps {
    current: number;
    items: Array<{ title: string }>;
}

export default function Stepper({ current, items }: IStepperProps) {
    return (
        <StepsContainer>
            <Steps
                current={current}
                labelPlacement="vertical"
                items={items}
                size="small"
                className="stepper"
            />
        </StepsContainer>
    );
}

const StepsContainer = styled.div`
    display: flex;
    padding: 1rem;
    width: 100%;

    .stepper {
        .ant-steps-item-icon {
            margin-top: 5px;
            height: 15px;
            width: 15px;
            background-color: ${AppTheme.colors.primary};
            border: 1px solid #fff;

            span {
                display: none;
            }
        }
        .ant-steps-item-active .ant-steps-item-icon {
            background-color: #fff;
            margin-top: 0;
            border: 2px solid ${AppTheme.colors.secondary};
            height: 25px;
            width: 25px;
        }

        .ant-steps-item-tail {
            padding: 4px 2px;

            ::after {
                background-color: #fff;
            }
        }

        .ant-steps-item-title {
            color: #fff !important; //FIXIT: remove important
            font-size: 10px;
        }
    }
`;
