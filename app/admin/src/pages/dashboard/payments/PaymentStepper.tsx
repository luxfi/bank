import CustomStepper from "../../../components/Stepper";
import { stepperStyleConfig } from "../../../components/styles/stepper-style-config";
export function PaymentStepper({ activeStep }: { activeStep: number }) {
    // const activeStyles = {
    //     border: stepperStyleConfig.activeBorder,
    //     width: stepperStyleConfig.activeSize,
    //     height: stepperStyleConfig.activeSize,
    //     zIndex: stepperStyleConfig.deep,
    //     marginTop: -5,
    // };
    //const inactiveStyles = { border: stepperStyleConfig.inactiveBorder };
    const steps = [
        {
            title: "Currency & Beneficiary",
        },
        {
            title: "Date  ",
        },
        {
            title: "Review",
        },
        {
            title: "Validate",
        },
        {
            title: "Complete",
        },
    ];
    return (
        <>
            <CustomStepper current={activeStep} items={steps} />
            {/* <AdvancdStepper
                style={{ color: AppTheme.colors.bg }}
                activeStep={activeStep}
                styleConfig={stepperStyleConfig}
            >
                <Step
                    label="Currency & Beneficiary"
                    style={activeStep == 0 ? activeStyles : inactiveStyles}
                />
                <Step
                    label="Date"
                    style={activeStep == 1 ? activeStyles : inactiveStyles}
                />
                <Step
                    label="Review"
                    style={activeStep == 2 ? activeStyles : inactiveStyles}
                />
                <Step
                    label="Validate"
                    style={activeStep == 3 ? activeStyles : inactiveStyles}
                />
                <Step
                    label="Complete"
                    style={activeStep == 4 ? activeStyles : inactiveStyles}
                />
            </AdvancdStepper> */}
        </>
    );
}
