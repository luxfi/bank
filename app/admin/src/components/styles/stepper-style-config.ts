import { StepStyleDTO } from "react-form-stepper/dist/components/Step/StepTypes";
import { AppTheme } from "../../AppTheme";

export const stepperStyleConfig: StepStyleDTO = {
  activeBgColor: AppTheme.colors.bg,
  activeTextColor: AppTheme.colors.bg,
  completedBgColor: AppTheme.colors.primary,
  completedTextColor: AppTheme.colors.bg,
  inactiveBgColor: AppTheme.colors.primary,
  inactiveTextColor: AppTheme.colors.bg,
  activeSize: '25px',
  size: '15px',
  circleFontSize: '0em',
  labelFontSize: '0.7em',
  borderRadius: '50%',
  fontWeight: '400',
  activeBorder: `2px solid ${AppTheme.colors.secondary}`,
  inactiveBorder: `1px solid ${AppTheme.colors.bg}`,
  deep: 1,
};

export const inverseStepperStyleConfig: StepStyleDTO = {
  activeBgColor: AppTheme.colors.primary,
  activeTextColor: AppTheme.colors.primary,
  completedBgColor: AppTheme.colors.bg,
  completedTextColor: AppTheme.colors.primary,
  inactiveBgColor: AppTheme.colors.bg,
  inactiveTextColor: AppTheme.colors.primary,
  activeSize: '25px',
  size: '15px',
  circleFontSize: '0em',
  labelFontSize: '0.7em',
  borderRadius: '50%',
  fontWeight: '400',
  activeBorder: `2px solid ${AppTheme.colors.secondary}`,
  inactiveBorder: `1px solid ${AppTheme.colors.primary}`,
  deep: 1,
};