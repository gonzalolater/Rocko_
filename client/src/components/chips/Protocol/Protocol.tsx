import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { LoanData, ProtocolProps } from '@/types/type';
import useLoanData from '@/hooks/useLoanData';
import { useLoanDB } from '@/db/loanDb';
import financial from '@/utility/currencyFormate';
import logger from '@/utility/logger';
import { NETWORK } from '@/constants/env';
import useSelectedNetwork from '@/hooks/useSelectedNetwork';
import HoverTooltip from '../HoverTooltip/HoverTooltip';

const TOOLTIPS = require('../../../locales/en_tooltips');

const Protocol: FC<ProtocolProps> = ({
  name,
  symbol,
  chain,
  protocolInfo,
  selectProtocol,
  handleProtocol,
}) => {
  const { setSelectedNetwork } = useSelectedNetwork();
  const { loanData, setLoanData } = useLoanData();
  const [protocolData, setProtocolData] = useState<LoanData>(loanData);
  const [monthAvgAPR, setMonthAvgAPR] = useState<any>(0);
  const [threeMonthAvgAPR, setThreeMonthAvgAPR] = useState<any>(0);
  // const [yearAvgAPR, setYearAvgAPR] = useState<any>(0);
  // const [avgRewardRate, setAvgRewardRate] = useState<any>(0);
  const {
    getMonthAverageAPR,
    getThreeMonthAverageAPR,
    // getYearAverageAPR,
    // getYearAvgRewardRate,
    getRewardRate,
  } = useLoanDB();

  const calculateInterestAccrued = (
    borrowing: number,
    apr: number,
    days: number,
  ) => {
    const seconds = 60 * 60 * 24 * days;
    const interest =
      borrowing * (1 + apr / seconds) ** ((seconds * days) / 365) - borrowing;
    return interest;
  };

  // TODO - Update Loan Data Only AFTER Selection, we need display only values for each network
  // currently this is getting overwritten by the last network data fetched

  const updateLoanData = async (protoData: any, setData: any) => {
    try {
      const borrowing = Number(loanData?.borrowing);
      const buffer = Number(loanData?.buffer);
      const collateralPrice = Number(loanData?.collateralPrice);
      const currentAPR =
        (await protoData.getBorrowAPR?.(chain || 'sepolia')) || 0; // protocolData?.currentAPR;
      const loanToValue = await protoData.getLTV(); // Number(protocolData?.loanToValue);
      const penalty = await protoData.getPenalty(); // protocolData?.liquidationPenalty;
      const threshold = await protoData.getThreshold(); // Number(protocolData?.liquidationThreshold);
      const rewardRate = await getRewardRate(chain);
      const rewardAmount = loanData?.rewardAmount;
      const collateralInUSD = (borrowing / loanToValue) * (1 + buffer / 100);
      const collateral = collateralInUSD / collateralPrice;
      const liquidationPrice = borrowing / threshold / collateral;
      const decreaseToLiquidationPrice =
        ((collateralPrice - liquidationPrice) / collateralPrice) * 100;
      const interestSixMonths = calculateInterestAccrued(
        borrowing,
        currentAPR / 100,
        182.5,
      );
      const interestOneYear = calculateInterestAccrued(
        borrowing,
        currentAPR / 100,
        365,
      );
      const interestTwoYears = calculateInterestAccrued(
        borrowing,
        currentAPR / 100,
        365 * 2,
      );

      if (setData) {
        setSelectedNetwork(chain || NETWORK);
        setData((prevLoanData: any) => {
          const newLoanData = {
            ...prevLoanData,
            currentAPR,
            sixMonthInterest: interestSixMonths,
            twelveMonthInterest: interestOneYear,
            twentyFourMonthInterest: interestTwoYears,
            loanToValue,
            liquidationPenalty: penalty,
            liquidationThreshold: threshold,
            collateralNeeded: collateral,
            liquidationPrice,
            decreaseToLiquidationPrice,
            rewardRate,
            rewardAmount,
          };
          // console.log({ newLoanData });
          return newLoanData;
        });
      }
    } catch (e) {
      logger(`Cannot Update Loan Data: ${JSON.stringify(e, null, 2)}`);
    }
  };

  useEffect(() => {
    updateLoanData(protocolInfo, setProtocolData);

    getMonthAverageAPR(chain)
      .then((_apr) => setMonthAvgAPR(_apr))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    getThreeMonthAverageAPR(chain)
      .then((_apr) => setThreeMonthAvgAPR(_apr))
      .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    // getYearAvgRewardRate()
    //   .then((_rate) => setAvgRewardRate(_rate))
    //   .catch((e) => logger(JSON.stringify(e, null, 2), 'error'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={
        selectProtocol === `${name}-${chain}`
          ? 'py-8 rounded-t-lg bg-zinc-50'
          : 'py-8'
      }
    >
      <div className="px-5">
        {/* protocol name */}
        <div className="flex items-center justify-between flex-col md:flex-row gap-2">
          <div className="flex items-center justify-start gap-1">
            <Image src={symbol || ''} alt={name || ''} width={20} height={20} />
            <h1 className="font-medium text-xl text-blackPrimary">{name}</h1>
            <p className="font-medium text-xs bg-[#E7EBFD] text-[#5E7CF1] rounded-md py-[2px] px-2">
              {chain}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-8 ">
            <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-0">
              <p className="text-xl font-bold text-[#141414]">
                <span style={{ fontSize: '32px' }}>
                  {protocolData?.currentAPR
                    ? financial(protocolData?.currentAPR, 2)
                    : null}
                </span>
                <span className="text-base">% APR</span>
              </p>

              <p className="font-medium text-xs text-[#7356BF] bg-[#F4F1FA] rounded-md py-[2px] px-2">
                Floating Rate
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (handleProtocol) {
                  handleProtocol(name, chain);
                  updateLoanData(protocolInfo, setLoanData);
                }
              }}
              className={`rounded-full py-[10px] px-6  text-sm font-semibold ${
                selectProtocol === `${name}-${chain}`
                  ? 'bg-[#eee] text-[#2C3B8D] border-[#2C3B8D] border-2'
                  : 'bg-[#eee] text-[#2C3B8D]'
              }`}
            >
              {selectProtocol === `${name}-${chain}` ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>

        {/* protocol info */}
        <div className="py-4 px-6 w-full mt-4">
          <div className="flex items-start justify-between gap-4 w-full flex-wrap">
            <div className="flex-1 min-w-[205px]">
              {/* info title */}
              <div className="flex items-center gap-1">
                <p className="font-medium text-blackPrimary">Trailing APRs</p>
                <HoverTooltip text={TOOLTIPS.TRAILING_APRS} />
              </div>
              {/* info */}
              <div className="py-3 space-y-3">
                <div className="">
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">30 Day</span>
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {financial(monthAvgAPR * 100, 2)}%
                  </p>
                </div>
                <div className="">
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">90 Day</span>
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {financial(threeMonthAvgAPR * 100, 2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[205px]">
              {/* info title */}
              <div className="flex items-center gap-1">
                <p className="font-medium text-blackPrimary">
                  Collateral Parameters (ETH)
                </p>
              </div>
              {/* info */}
              <div className="py-3 space-y-3">
                <div>
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">Max Loan-to-Value</span>
                    <HoverTooltip text={TOOLTIPS.MAX_LTV} />
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {Number(protocolData?.loanToValue) * 100}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">Liquidation Threshold</span>
                    <HoverTooltip text={TOOLTIPS.LIQUIDATION_THRESHOLD} />
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {Number(protocolData?.liquidationThreshold) * 100}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">Liquidation Penalty</span>
                    <HoverTooltip text={TOOLTIPS.LIQUIDATION_PENALTY} />
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {financial(Number(protocolData?.liquidationPenalty) * 100)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[205px]">
              {/* info title */}
              <div className="flex items-center gap-1">
                <p className="font-medium text-blackPrimary">Rewards</p>
                <HoverTooltip text={TOOLTIPS.PROTOCOL_REWARDS} />
              </div>
              {/* info */}
              <div className="py-3 space-y-3">
                <div>
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">Current Rate</span>
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {financial(Number(protocolData?.rewardRate) * 100, 2)}%
                  </p>
                </div>
                {/* <div>
                  <p className="text-sm text-[#545454] flex items-center justify-start gap-1">
                    <span className="">Trailing 365 average</span>
                  </p>
                  <p className="font-semibold text-blackPrimary">
                    {financial(avgRewardRate * 100, 2)}%
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protocol;
