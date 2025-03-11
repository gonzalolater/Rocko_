/* eslint-disable import/order */
import { FC, FocusEvent, useState, useEffect } from 'react';
import { CoinCardProps, RiskStep } from '@/types/type';
import Link from 'next/link';
import LoanSummary from '@/components/chips/LoanSummary/LoanSummary';
import useLoanData from '@/hooks/useLoanData';
import CoinCard from '@/components/chips/CoinCard/CoinCard';
import extrabitcoin from '@/assets/coins/extrabitcoin.svg';
import extra from '@/assets/coins/extrabitcoin-se.svg';
import etherIcon from '@/assets/coins/Extra(ETH).svg';
import RadioInput from '@/components/RadioInput';
import logger from '@/utility/logger';

const StepFour: FC<RiskStep> = ({ title, subTitle, description }) => {
  const [selectedValue, setSelectedValue] = useState<number>(150);
  const [value, setValue] = useState<number>(10);
  const [selectedCoin, setSelectedCoin] = useState('');
  const { loanData, setLoanData } = useLoanData();
  const [hasOther, setHasOther] = useState(0);

  const initialize = () => {
    // for keeping status
    if (loanData?.buffer !== 0 && loanData?.buffer) {
      setValue(loanData?.buffer);

      if (setLoanData) {
        setLoanData((prevLoanData) => ({
          ...prevLoanData,
          activeNextButton: true,
        }));
      }
    }
  };

  const updateLoanData = async (newBuffer: number) => {
    try {
      const loanToValue: any = loanData?.loanToValue;
      const threshold: any = loanData?.liquidationThreshold;
      const ethPrice = loanData?.collateralPrice;
      const collateralPrice = Number(loanData?.collateralPrice);
      const collateralInUSD = loanData?.borrowing
        ? (loanData?.borrowing / loanToValue) * (1 + newBuffer / 100)
        : 0;

      const collateral = collateralInUSD / ethPrice;
      const liquidationPrice = loanData?.borrowing
        ? loanData?.borrowing / threshold / collateral
        : 0;
      const decreaseToLiquidationPrice =
        ((collateralPrice - liquidationPrice) / collateralPrice) * 100;

      if (setLoanData) {
        setLoanData((prevLoanData) => ({
          ...prevLoanData,
          buffer: newBuffer,
          collateralNeeded: collateral,
          liquidationPrice,
          decreaseToLiquidationPrice,
          activeNextButton: true,
        }));
      }
    } catch (e) {
      logger(
        `Cannot update loan buffer: ${JSON.stringify(e, null, 2)}`,
        'error',
      );
    }
  };

  /* eslint-disable */
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);

    if (setLoanData) await updateLoanData(newValue);
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    let newValue = parseInt(event.target.value, 10);

    if (newValue < 10) newValue = 10;
    if (newValue > 1000) newValue = 1000;

    setValue(newValue);
    if (setLoanData) updateLoanData(newValue);
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (hasOther) {
      updateLoanData(selectedValue);
    } else {
      setSelectedCoin('');
      updateLoanData(value);
    }

    const inputValue = event.target.value;
    setHasOther(parseInt(inputValue) === 0 ? 1 : 0);
  };

  const collateralCard = [
    {
      id: 1,
      icon: etherIcon,
      title: '150% extra',
      description: 'Lower risk of liquidation',
    },
    {
      id: 2,
      icon: extra,
      title: '100% extra',
      description: '',
    },
    {
      id: 3,
      icon: extrabitcoin,
      title: '50% extra',
      description: 'Higher risk of liquidation',
    },
  ];

  const handleSelect = ({ coinShortName }: CoinCardProps) => {
    let buffer = 0;
    switch (coinShortName) {
      case collateralCard[0].title:
        buffer = 150;
        break;
      case collateralCard[1].title:
        buffer = 100;
        break;
      case collateralCard[2].title:
        buffer = 50;
        break;
      default:
        break;
    }

    setHasOther(0);
    setSelectedCoin(coinShortName);
    setSelectedValue(buffer);

    updateLoanData(buffer);
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
            <p className=" text-sm font-medium mt-1 text-blackPrimary lg:text-start text-center">
              {subTitle}
            </p>
            <div className="my-4 py-4 grid grid-cols-2 lg:grid-cols-3 gap-6">
              {collateralCard.map((card) => (
                <CoinCard
                  key={card.id}
                  coinIcon={card.icon}
                  coinShortName={card.title}
                  coinName={card.description}
                  selectedCoin={selectedCoin}
                  handleSelect={handleSelect}
                  currentAPR={1}
                  isComingSoon={false}
                  className={
                    card.title === selectedCoin
                      ? 'border-[#2C3B8D] !bg-grayPrimary'
                      : 'border-whiteSecondary bg-white '
                  }
                />
              ))}
            </div>
            <RadioInput
              id="wallet3"
              name="paymentMethod"
              checked={Boolean(hasOther)}
              value={hasOther}
              onChange={handlePaymentMethodChange}
              label="Input other value"
            />
            {hasOther === 1 && (
              <div className="mt-[16px]">
                <div className="max-w-[284px] w-full relative">
                  <label className="-translate-y-1/2 text-[#141414] text-[16px] top-[50%]  right-[16px] absolute">
                    %
                  </label>
                  <input
                    type="number"
                    className="w-full py-[8px] px-[16px] border border-[#E6E6E6] rounded-[10px] block focus:outline-none w-full number-input"
                    min="10"
                    max="1000"
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={(event) => {
                      const keyPressed = event.key;
                      const isDecimalDigit = /^\d+$/.test(keyPressed);
                      const isAllowedHexChar = /^[a-eA-E]+$/.test(keyPressed);

                      if (
                        (!isDecimalDigit && !(event.key === 'Backspace')) ||
                        isAllowedHexChar
                      ) {
                        event.preventDefault();
                      }
                      if (event.key === '-') {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {/* ${value >= 400 ? ' pt-6 ' : 'pt-12'} */}
            <p className="text-sm text-blackSecondary bg-[#F9F9F9] text-[#545454] text-[14px] leading-5 rounded-[16px] md:p-[24px] p-[16px]  mt-[24px]">
              {description}{' '}
              <Link href="/" className="underline">
                Learn more.
              </Link>
            </p>
          </div>
        </div>
        <div className="p-6 border border-[#E2E2E2] flex-1 rounded-2xl">
          <LoanSummary />
        </div>
      </section>
    </main>
  );
};

export default StepFour;
