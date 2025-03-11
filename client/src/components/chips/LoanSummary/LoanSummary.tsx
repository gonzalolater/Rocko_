'use client';

import Image from 'next/image';
import useLoanData from '@/hooks/useLoanData';
import financial from '@/utility/currencyFormate';
import HoverTooltip from '../HoverTooltip/HoverTooltip';

const TOOLTIPS = require('../../../locales/en_tooltips');

function LoanSummary() {
  const { loanData } = useLoanData();

  return (
    <>
      <p className="text-2xl font-medium text-blackPrimary">Loan Summary</p>
      <div className="my-4">
        <p className="text-blackPrimary">Borrowing</p>
        <div className="flex items-center mt-4 mb-2 justify-between">
          <p className="text-2xl font-medium tracking-[-0.5px] text-blackPrimary">
            {loanData?.borrowing ? financial(loanData?.borrowing) : '--'}
            <span className="text-base"> {loanData?.coin}</span>
          </p>
          {loanData?.coinIcon && (
            <Image src={loanData?.coinIcon} width={24} height={24} alt="usdc" />
          )}
        </div>
        <p className="text-sm text-blackSecondary">
          {(loanData?.coin !== 'USD' &&
            loanData?.borrowing &&
            `~$${financial(loanData?.borrowing)}`) ||
            ''}
        </p>
      </div>
      <hr className=" border-whiteSecondary" />
      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2 text-blackPrimary">
          Current APR
          <HoverTooltip text={TOOLTIPS.CURRENT_APR} />
        </div>
        <p className="text-2xl font-medium tracking-[-0.5px] text-blackPrimary">
          {(loanData?.currentAPR && loanData?.protocol && (
            <>
              {financial(loanData?.currentAPR, 2)}
              <span className="text-base">%</span>
            </>
          )) ||
            '--'}
        </p>
      </div>
      <hr className=" border-whiteSecondary" />
      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2 text-blackPrimary">
          Projected Interest (in USD)
          <HoverTooltip text={TOOLTIPS.PROJECTED_INTEREST} />
        </div>
        <p className="text-sm flex items-center justify-between font-medium ">
          <span className="text-blackSecondary">6 months</span>
          <span className="text-blackPrimary">
            {(loanData?.sixMonthInterest && loanData?.protocol && (
              <>${financial(loanData?.sixMonthInterest, 2)}</>
            )) ||
              '--'}
          </span>
        </p>
        <p className="text-sm flex items-center justify-between font-medium ">
          <span className="text-blackSecondary">12 months</span>
          <span className="text-blackPrimary">
            {' '}
            {(loanData?.twelveMonthInterest && loanData?.protocol && (
              <> ${financial(loanData?.twelveMonthInterest, 2)}</>
            )) ||
              '--'}
          </span>
        </p>
        <p className="text-sm flex items-center justify-between font-medium ">
          <span className="text-blackSecondary">24 months</span>
          <span className="text-blackPrimary">
            {' '}
            {(loanData?.twentyFourMonthInterest && loanData?.protocol && (
              <> ${financial(loanData?.twentyFourMonthInterest, 2)}</>
            )) ||
              '--'}
          </span>
        </p>
      </div>

      <hr className=" border-whiteSecondary" />
      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2 text-blackPrimary">
          Collateral Needed
          <HoverTooltip text={TOOLTIPS.COLLATERAL_NEEDED} />
          {(loanData?.collateralNeeded &&
            loanData?.cryptoName &&
            loanData?.buffer === 0 && (
              <p className="font-medium text-[10px] text-[#5E7CF1] bg-[#E7EBFD] rounded-md py-[2px] px-2">
                Estimated Minimum Amount
              </p>
            )) ||
            ''}
        </div>
        <div
          className="flex items-center
            justify-between gap-1"
        >
          <p className="text-2xl font-medium tracking-[-0.5px] text-blackPrimary">
            {loanData?.collateralNeeded && loanData?.cryptoName ? (
              <>
                {' '}
                {financial(loanData?.collateralNeeded, 3)}{' '}
                <span className="text-base"> {loanData?.cryptoName}</span>
              </>
            ) : (
              '--'
            )}
          </p>
          {loanData?.cryptoIcon && (
            <Image
              src={loanData?.cryptoIcon || ''}
              alt={loanData?.cryptoName || ''}
              width={24}
              height={24}
            />
          )}
        </div>

        <p className="text-[#545454] text-sm ">
          {(loanData?.collateralNeeded && (
            <>
              {' '}
              $
              {financial(
                Number(loanData?.collateralNeeded) *
                  Number(loanData?.collateralPrice),
                2,
              )}
            </>
          )) ||
            ''}
        </p>
      </div>
      <hr className=" border-whiteSecondary" />
      <div className="my-4 space-y-2">
        <div className="flex items-center gap-2 text-blackPrimary">
          Liquidation Price{' '}
          {loanData?.cryptoName && `(${loanData?.cryptoName})`}
          <HoverTooltip text={TOOLTIPS.LIQUIDATION_PRICE} />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-medium tracking-[-0.5px] text-blackPrimary">
            {(loanData?.liquidationPrice &&
              loanData?.protocol &&
              `$${financial(loanData?.liquidationPrice, 2)}`) ||
              '--'}
          </p>
          {loanData?.buffer &&
          loanData?.liquidationPrice &&
          loanData?.decreaseToLiquidationPrice ? (
            <p className="font-medium text-[10px] text-[#5E7CF1] bg-[#E7EBFD] rounded-md py-[2px] px-2">
              -{financial(loanData?.decreaseToLiquidationPrice)}% from current
              price
            </p>
          ) : null}
        </div>
        {(loanData?.collateralPrice && loanData?.cryptoName && (
          <p className="text-sm flex items-center justify-between font-medium ">
            <span className="text-blackSecondary">
              Current Price of {loanData?.cryptoName}
            </span>
            <span className="text-blackPrimary">
              ${financial(loanData?.collateralPrice, 2)}
            </span>
          </p>
        )) ||
          ''}
      </div>
    </>
  );
}

export default LoanSummary;
