import { BusinessRiskAssessmentProvider } from '@/context/businessRiskAssessment';

import Steps from './Steps';

export default function BusinessRiskAssessmentForm() {
  return (
    <BusinessRiskAssessmentProvider>
      <Steps />
    </BusinessRiskAssessmentProvider>
  );
}
