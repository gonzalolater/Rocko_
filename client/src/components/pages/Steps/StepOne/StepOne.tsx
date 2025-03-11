'use client';

import Link from 'next/link';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import LoanSummary from '@/components/chips/LoanSummary/LoanSummary';
import CoinCard from '@/components/chips/CoinCard/CoinCard';
import useLoanData from '@/hooks/useLoanData';
import financial from '@/utility/currencyFormate';
import { CurrencyStep } from '@/types/type';
import usdc from '@/assets/coins/USD Coin (USDC).svg';
import { useSingleLoan } from '@/contract/single';
import logger from '@/utility/logger';
import { FLAG_USD_LOANS } from '@/constants/featureFlags';

interface FormData {
  numberInput: string;
}

const StepOne: FC<CurrencyStep> = ({ title, currency }) => {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [activeInputField, setActiveInputField] = useState(true);
  const {
    register,
    formState: { errors, isValid },
    setValue,
    getValues,
    // TODO figure out why onBlur isnt working
  } = useForm<FormData>({ mode: 'onBlur' });

  const { loanData, setLoanData } = useLoanData();
  const {
    getETHPrice,
    // getBorrowAPR,
    getLTV,
    getPenalty,
    getThreshold,
    getRewardRate,
    getRewardAmount,
  } = useSingleLoan();

  const handleBorrowValueChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.target.value;
    const num =
      inputValue === '' ? 0 : parseFloat(inputValue.replace(/,/g, ''));
    setValue('numberInput', financial(num), { shouldValidate: true });
    const currentPrice = await getETHPrice();
    const loanToValue = await getLTV();
    const collateralInUSD = (num / loanToValue) * (1 + loanData?.buffer / 100);
    const collateral = collateralInUSD / currentPrice;

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        borrowing: num || 0,
        collateralNeeded: collateral,
      }));
    }
  };

  const initialize = () => {
    setSelectedCoin('USDC');
    if (loanData?.borrowing !== 0)
      setValue('numberInput', financial(loanData?.borrowing), {
        shouldValidate: true,
      });

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        coin: 'USDC',
        currentAPR: 0,
        coinIcon: usdc,
      }));
    }
  };

  const updateLoanData = async () => {
    try {
      const currentPrice = await getETHPrice();
      // const currentAPR = await getBorrowAPR();
      const loanToValue = await getLTV();
      const penalty = await getPenalty();
      const threshold = await getThreshold();
      const rewardRate = await getRewardRate();
      const rewardAmount = await getRewardAmount();

      if (setLoanData) {
        setLoanData((prevLoanData) => ({
          ...prevLoanData,
          collateralPrice: currentPrice,
          // currentAPR,
          loanToValue,
          liquidationPenalty: penalty,
          liquidationThreshold: threshold,
          rewardRate,
          rewardAmount,
        }));
      }
    } catch (e) {
      logger(`Cannot update loan data: ${JSON.stringify(e, null, 2)}`);
    }
  };

  useEffect(() => {
    updateLoanData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const inputElement = document.getElementById('numberField');
    if (inputElement) {
      inputElement.focus();
    }

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (info: any) => {
    setSelectedCoin(info.coinShortName);
    // when select coin then can type value
    setActiveInputField(true);

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        coin: info.coinShortName,
        currentAPR: parseFloat(info.currentAPR),
        coinIcon: info.coinIcon,
      }));
    }
  };

  useEffect(() => {
    const borrowingValue = getValues('numberInput');

    if (setLoanData) {
      setLoanData((prevLoanData) => ({
        ...prevLoanData,
        activeNextButton: true,
        // eslint-disable-next-line no-nested-ternary
        nextValidation: borrowingValue
          ? errors.numberInput
            ? errors.numberInput.message
            : ''
          : 'defaultError',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, isValid]);

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
            <div className="grid grid-cols-2 gap-6 w-full my-4 py-4 max-w-[420px]">
              {currency?.map((singleCurrency) => (
                // <div key={singleCurrency.id} className="max-w-[200px] flex-1">
                <CoinCard
                  key={singleCurrency.id}
                  coinIcon={singleCurrency.symbol || ''}
                  coinShortName={singleCurrency.name || ''}
                  coinName={singleCurrency.fullName || ''}
                  selectedCoin={selectedCoin}
                  handleSelect={handleSelect}
                  currentAPR={singleCurrency.currentAPR}
                  isComingSoon={singleCurrency.comingSoon}
                />
                // </div>
              ))}
            </div>
            <div className="py-6 space-y-6">
              <p className="text-blackPrimary font-medium text-xl">
                How much do you want to borrow?
              </p>
              <div className="flex items-center justify-start gap-4 p-4 rounded-[10px] border border-[#E6E6E6] max-w-[310px] w-full bg-white ">
                <input
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register('numberInput', {
                    required: 'Number is required',
                    validate: (value) => {
                      const num = parseFloat(value.replace(/,/g, ''));
                      if (Number.isNaN(num)) {
                        return 'Invalid number';
                      }
                      if (num < 100) {
                        return 'Number must be at least 100';
                      }
                      if (num > 10000000) {
                        return 'Maximum amount is 10,000,000';
                      }
                      return true;
                    },
                  })}
                  type="text"
                  id="numberField"
                  min={1}
                  onKeyDown={(event) => {
                    if (
                      !/^\d$/.test(event.key) &&
                      !/^Control|Tab|Arrow|Backspace|Delete$/.test(event.key)
                    ) {
                      event.preventDefault();
                    }
                  }}
                  className="w-52 md:w-auto md:flex-1 focus:outline-none border-none bg-white number-input"
                  placeholder="10,000"
                  disabled={!activeInputField}
                  onChange={handleBorrowValueChange}
                />
                <label htmlFor="numberField">{selectedCoin}</label>
              </div>
              {!loanData?.activeNextButton && errors.numberInput && (
                <div className="text-xs text-red-500">
                  {errors.numberInput.message}
                </div>
              )}
            </div>
            {FLAG_USD_LOANS && (
              <div className=" p-4 lg:p-6 space-y-6 lg:space-y-10 bg-whiteTertiary rounded-2xl">
                <p className="text-sm text-blackSecondary">
                  USD is only available for U.S. Coinbase users at this time. If
                  you do not have a Coinbase account, you can receive USDC (a
                  USD-backed stablecoin with a 1:1 value) and convert it into
                  USD on many U.S. crypto exchanges.{' '}
                  <Link href="/" className="underline">
                    Learn more.
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border border-[#E2E2E2] flex-1 rounded-2xl">
          <LoanSummary />
        </div>
      </section>
    </main>
  );
};

export default StepOne;
