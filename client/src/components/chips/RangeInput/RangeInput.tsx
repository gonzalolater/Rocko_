import financial from '@/utility/currencyFormate';
import React, { useEffect, useRef, useState } from 'react';
import { useSingleLoan } from '@/contract/single';
import logger from '@/utility/logger';

function RangeInput({
  buffer,
  minCollateral,
  collateralValue,
}: {
  buffer: number;
  minCollateral: number;
  collateralValue: string;
}) {
  const valueDivRef = useRef<HTMLDivElement | null>(null);
  const [thumbPosition, setThumbPosition] = useState<number>(0);

  const { getETHPrice } = useSingleLoan();
  const [collateralPrice, setCollateralPrice] = useState(0);

  const valueDivStyle = {
    left: `calc(${thumbPosition}% - ${80 / 2}px)`,
  };

  useEffect(() => {
    if (valueDivRef.current)
      setThumbPosition(((buffer - 10) / (400 - 10)) * 100);
  }, [buffer]);

  useEffect(() => {
    getETHPrice()
      .then((_price) => setCollateralPrice(_price))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));
  });

  return (
    <div className="flex items-center justify-between gap-1 md:gap-3 pb-[46px] pt-[70px]">
      <p className="text-sm md:text-base sm:block hidden">
        Higher Risk <br /> of Liquidation
      </p>
      <p className="text-sm md:text-base sm:hidden block">HR</p>

      <div className="flex-1 flex items-start">
        <div className="w-10 md:w-20 h-[6px]" />

        {/* fake bar space of right */}
        <div className=" flex-1">
          {/* rang slider container */}
          <div className="relative w-full">
            {/* fake bar start */}
            <div className="w-10 md:w-20 h-[6px] rounded-full bg-[#FF3124] mt-[2.3px] absolute top-1/2 -translate-y-1/2 right-[calc(100%-4px)]">
              {/* <div className="frame h-3 w-3 bg-[#2C3B8D] rotate-180 absolute -top-2  -right-3 mt-[-3px]" /> */}
              <div className="frame h-3 w-3 bg-[#FF3124] absolute top-[2px] absolute right-[-0.3rem] mt-[11px]" />
            </div>
            {/* fake bar end */}
            {/* initial fix value start */}
            <div className="flex items-center justify-between w-fit absolute top-10 absolute left-[-4.5rem]">
              <div className="text-center">
                <p className="text-[#545454] text-xs whitespace-nowrap">
                  Minimum Collateral Required:
                </p>
                <p className="text-[#141414] text-xs whitespace-nowrap">
                  {financial(minCollateral, 3)} ETH ($
                  {financial(minCollateral * collateralPrice, 2)})
                </p>
              </div>
            </div>
            {/* initial fix value end */}
            <input
              type="range"
              className="range w-full "
              min="10"
              max="400"
              value={buffer}
              data-value={buffer}
              style={{
                background: `linear-gradient(to right, #2C3B8D 0%, #2C3B8D ${thumbPosition}%, #E2E2E2 ${thumbPosition}%, #E2E2E2 100%)`,
              }}
            />{' '}
            <div
              ref={valueDivRef}
              className="absolute w-23 h-16 left-0 -top-16 text-center text-white bg-[#2C3B8D] rounded-full py-3 px-4"
              style={valueDivStyle}
            >
              <p className="">${collateralValue}</p>
              {/*  <div className="w-1 h-10 bg-[#2C3B8D] absolute top-full left-1/2 -translate-x-1/2"></div> */}
              <p className="text-center text-white text-sm font-thin">
                Current Value
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base sm:hidden block">LR</p>
      <p className="text-sm md:text-base sm:block hidden">
        Lower Risk <br /> of Liquidation
      </p>
    </div>
  );
}

export default RangeInput;
