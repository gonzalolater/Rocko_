'use client';

import useLoanData from '@/hooks/useLoanData';
import { useAddress } from '@thirdweb-dev/react';
import Link from 'next/link';

interface Props {
  steps?: number;
  currentStep?: number;
  setIsFinalized: React.Dispatch<any>;
}

function Footer(props: Props) {
  const { steps = 1, currentStep = 1, setIsFinalized } = props;
  const { loanData } = useLoanData();
  const address = useAddress();

  const isValidateNextButton = () => {
    const isValidate =
      loanData?.paymentMethod === 'ethereum'
        ? address !== null
        : loanData?.paymentMethod !== '';

    return isValidate;
  };

  return (
    <div className="mt-24 fixed bottom-0 left-0 w-full bg-white ">
      <div className="bg-[#F7F7F7] h-1 w-full relative">
        <div
          style={{
            width: `${(100 / steps) * (currentStep + 1)}%`,
          }}
          className="duration-500 bg-blue h-full absolute left-0 top-0"
        />
      </div>
      <div className="container mx-auto">
        <div className="p-4 flex items-center justify-end  ">
          <div className="flex items-center justify-end gap-3">
            <Link href="/loan-dashboard/1?active=true">
              <button
                className={`font-semibold  text-xs md:text-sm text-blue  py-[10px]  px-6 rounded-full ${
                  currentStep === 0 ? 'bg-grayPrimary' : 'bg-gray-200'
                }`}
                disabled={currentStep === 0}
              >
                Back
              </button>
            </Link>
            <button
              onClick={() => setIsFinalized(true)}
              className={`font-semibold  text-xs md:text-sm ${
                isValidateNextButton() ? 'bg-blue' : 'bg-blue/40'
              } py-[10px]  px-6 rounded-full text-white`}
              disabled={!isValidateNextButton()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
