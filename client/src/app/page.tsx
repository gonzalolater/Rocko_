'use client';

import StepOne from '@/components/pages/Steps/StepOne/StepOne';
import StepTwo from '@/components/pages/Steps/StepTwo/StepTwo';
import StepThree from '@/components/pages/Steps/StepThree/StepThree';
import StepFour from '@/components/pages/Steps/StepFour/StepFour';
import StepFive from '@/components/pages/Steps/StepFive/StepFive';

import Stepper, { Step } from '@/components/Stepper';
import usePlatformStatus from '@/hooks/usePlatformStatus';
import Status from '@/components/Status';

const steps: Step[] = [
  { label: 'Loan Amount', component: StepOne },
  { label: 'Collateral Asset', component: StepTwo },
  { label: 'Lending Protocol', component: StepThree },
  { label: 'Collateral Buffer', component: StepFour },
  { label: 'Loan Summary', component: StepFive },
];

export default function Home() {
  const { loansPaused, transactionsPaused } = usePlatformStatus();

  return transactionsPaused || loansPaused ? (
    <Status />
  ) : (
    <Stepper steps={steps} />
  );
}
