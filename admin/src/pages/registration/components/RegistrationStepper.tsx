import { Step, Stepper } from "react-form-stepper";
import styled from "styled-components";
import { AdvancdStepper } from "../../../components/AdvancedStepper";
import { stepperStyleConfig } from "../../../components/styles/stepper-style-config";
import { device } from "../../../utils/media-query-helpers";
export function RegistrationStepper({ activeStep }: { activeStep: number }) {
    const activeStyles = {border: stepperStyleConfig.activeBorder, width: stepperStyleConfig.activeSize, height: stepperStyleConfig.activeSize, zIndex: stepperStyleConfig.deep, marginTop: -5};
    const inactiveStyles = {border: stepperStyleConfig.inactiveBorder};
    return (
        <AdvancdStepper 
            activeStep={activeStep}
            styleConfig={stepperStyleConfig}>
            <Step label="Account"  style={activeStep == 0 ? activeStyles : inactiveStyles} />
            <Step label="Your Information" style={activeStep == 1 ? activeStyles : inactiveStyles} />
            <Step label="Expected Activity" style={activeStep == 2 ? activeStyles : inactiveStyles} />
            <Step label="Documents"style={activeStep == 3 ? activeStyles : inactiveStyles} />
        </AdvancdStepper>
    )
}