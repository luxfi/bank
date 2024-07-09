import { IndividualRiskAssessmentProvider } from '@/context/IndividualRiskAssessment';

import Steps from './Steps';

export default function IndividualRiskAssessmentForm() {
  return (
    <IndividualRiskAssessmentProvider>
      <Steps />
    </IndividualRiskAssessmentProvider>
  );
}
