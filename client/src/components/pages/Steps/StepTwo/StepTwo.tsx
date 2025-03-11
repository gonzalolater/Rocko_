'use client';

import { FC } from 'react';
import { AssetStep } from '@/types/type';
import ChooseCoins from '@/components/chips/ChooseCoins/ChooseCoins';
import LoanSummary from '@/components/chips/LoanSummary/LoanSummary';

const StepTwo: FC<AssetStep> = ({ assets, title, description }) => (
  <main className="container mx-auto px-[15px] py-4 sm:py-6 lg:py-10">
    {/* title start  */}
    <h1 className="text-2xl lg:text-3xl text-blackPrimary lg:text-start text-center">
      Customize Your Loan
    </h1>
    {/* title end  */}

    {/* Choose section  */}
    <section className="flex gap-4 lg:gap-10 my-6 flex-col sm:flex-row ">
      <div className="w-full sm:w-8/12 ">
        <div className="p-6 border border-whiteSecondary rounded-2xl">
          <p className=" text-xl font-medium  text-blackPrimary lg:text-start text-center">
            {title}
          </p>

          <ChooseCoins assets={assets} />

          <div className=" p-4 lg:p-6 space-y-6 lg:space-y-10 bg-whiteTertiary rounded-2xl">
            <p className="text-sm text-blackSecondary">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6 border border-[#E2E2E2] flex-1 rounded-2xl">
        <LoanSummary />
      </div>
    </section>
  </main>
);

export default StepTwo;
