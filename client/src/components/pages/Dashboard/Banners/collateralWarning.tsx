import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import StatusWarning from '@/assets/StatusWarning.svg';

const CollateralWarningBanner = ({ buffer }: { buffer: number }) => {
  const [collateralWarning, setCollateralWarning] = useState(false);

  useEffect(() => {
    // Check buffer value and set collateral warning
    if (buffer < 0.1) {
      setCollateralWarning(true);
    }
  }, [buffer]);

  if (collateralWarning === true) {
    return (
      <div className="flex flex-col bg-[#FEF3DE] rounded-2xl p-4 my-4">
        <div className="flex gap-4 items-center">
          <Image src={StatusWarning} width={24} height={24} alt="warning" />
          <p className="text-center md:text-left font-semibold">
            Warning! Your collateral is close to liquidation.
          </p>
        </div>
        <p className="text-center md:text-left font-regular pl-10">
          Your collateral is close to being liquidated by the lending protocol.
          To prevent this, add more collateral to your loan or pay it down using
          the options below.
        </p>
      </div>
    );
  }
};

export default CollateralWarningBanner;
