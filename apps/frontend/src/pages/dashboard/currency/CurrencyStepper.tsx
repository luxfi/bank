import { Step, Stepper } from "react-form-stepper";
import CustomStepper from "../../../components/Stepper";
import styled from "styled-components";
import { AppTheme } from "../../../AppTheme";
import { InsideStepper as AdvancdStepper } from "../../../components/AdvancedStepper";
import { stepperStyleConfig } from "../../../components/styles/stepper-style-config";
import { device } from "../../../utils/media-query-helpers";
import { useEffect, useState } from "react";

export function CurrencyStepper({ activeStep }: { activeStep: number }) {
    const activeStyles = {
        border: stepperStyleConfig.activeBorder,
        width: stepperStyleConfig.activeSize,
        height: stepperStyleConfig.activeSize,
        zIndex: stepperStyleConfig.deep,
        marginTop: -5,
    };
    const inactiveStyles = { border: stepperStyleConfig.inactiveBorder };
    const gateway = window.localStorage.getItem("gateway");
    const allowsDateChange = gateway !== "openpayd";

    const [steps, setSteps] = useState([
        {
            title: "Currency & Amount",
        },
        {
            title: "Quote",
        },
        {
            title: "Complete",
        },
    ]);

    useEffect(() => {
        if (!allowsDateChange) return;
        setSteps((prev) => {
            prev.splice(1, 0, {
                title: "Select a Date",
            });
            return prev;
        });
    }, []);

    return (
        <>
            <CustomStepper current={activeStep} items={steps} />
            {/* <AdvancdStepper
                style={{ color: AppTheme.colors.bg }}
                activeStep={activeStep}
                styleConfig={stepperStyleConfig}
            >
                <Step
                    label="Currency & Amount"
                    style={activeStep == 0 ? activeStyles : inactiveStyles}
                />
                {allowsDateChange && (
                    <Step
                        label="Select a Date"
                        style={activeStep == 1 ? activeStyles : inactiveStyles}
                    />
                )}
                <Step
                    label="Quote"
                    style={
                        activeStep == 2 - (allowsDateChange ? 0 : 1)
                            ? activeStyles
                            : inactiveStyles
                    }
                />
                <Step
                    label="Complete"
                    style={
                        activeStep == 3 - (allowsDateChange ? 0 : 1)
                            ? activeStyles
                            : inactiveStyles
                    }
                />
            </AdvancdStepper> */}
        </>
    );
}
